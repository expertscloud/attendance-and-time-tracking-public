import { app, BrowserWindow, Menu, ipcMain, Notification, shell, powerMonitor } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createIdleDetector } from './idleDetection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On Linux, Chromium resolves navigator.geolocation through Google's network
// geolocation service, which silently fails without an API key — without this
// key Linux users can never pass the location check. macOS ignores the key
// (CoreLocation only, gated on the Location Services toggle) and Windows uses
// the platform location API, so neither needs it.
const GOOGLE_API_KEY = import.meta.env?.VITE_GOOGLE_API_KEY;
if (GOOGLE_API_KEY) {
  process.env.GOOGLE_API_KEY = GOOGLE_API_KEY;
}

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
const isDevelopment = Boolean(VITE_DEV_SERVER_URL);
const APP_ID = 'com.tickly.app';
const APP_NAME = 'Tickly';
const APP_ICON = path.join(process.env.VITE_PUBLIC, 'icon.png');
const NOTIFICATION_ICON = path.join(process.env.VITE_PUBLIC, 'logo-small.png');

app.setName(APP_NAME);
if (process.platform === 'win32') {
  app.setAppUserModelId(APP_ID);
}

let win;
let startupLogFile = null;

function writeStartupLog(message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  console.log(line.trim());

  if (!startupLogFile) return;

  try {
    fs.appendFileSync(startupLogFile, line, 'utf8');
  } catch (error) {
    console.error('Failed to write startup log file:', error);
  }
}

function initializeStartupLogging() {
  try {
    const logsDir = path.join(app.getPath('userData'), 'logs');
    fs.mkdirSync(logsDir, { recursive: true });
    startupLogFile = path.join(logsDir, 'startup.log');
    writeStartupLog(`App booting. version=${app.getVersion()} platform=${process.platform} packaged=${app.isPackaged}`);
  } catch (error) {
    console.error('Failed to initialize startup logging:', error);
  }

  process.on('uncaughtException', err => {
    writeStartupLog(`Uncaught exception: ${err.stack || err.message}`);
  });

  process.on('unhandledRejection', reason => {
    writeStartupLog(`Unhandled rejection: ${String(reason)}`);
  });
}

function ensureLinuxSandboxCompatibility() {
  if (process.platform !== 'linux' || !app.isPackaged) return;

  try {
    const sandboxPath = path.join(path.dirname(process.execPath), 'chrome-sandbox');
    const sandboxStat = fs.statSync(sandboxPath);
    const requiredMode = 0o4755;
    const actualMode = sandboxStat.mode & 0o7777;
    const isRootOwned = sandboxStat.uid === 0;

    if (!isRootOwned || actualMode !== requiredMode) {
      console.warn(`Linux chrome-sandbox permissions are invalid (${sandboxPath}). Falling back to --no-sandbox.`);
      app.commandLine.appendSwitch('no-sandbox');
    }
  } catch (error) {
    console.warn('Unable to verify linux sandbox helper. Falling back to --no-sandbox.', error);
    app.commandLine.appendSwitch('no-sandbox');
  }
}

ensureLinuxSandboxCompatibility();

//******************************************* */
// macOS backgrounds a renderer whose window is minimized or on another Space
// (occluded) and throttles its timers — the per-window backgroundThrottling:false
// flag does NOT cover occluded/minimized windows. A throttled renderer stalls the
// worked-time sync heartbeat, so after the backend's offline threshold an actively
// working user gets recorded as "away". These keep the renderer running regardless
// of window visibility.
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');
//******************************************* */

if (isDevelopment) {
  app.commandLine.appendSwitch('remote-debugging-port', '9333');
}
initializeStartupLogging();

// Enforce single-instance: a second launch exits immediately and focuses the existing window.
// Skip in dev so a local build can run alongside an installed copy (both share the bundle ID).
if (!isDevelopment && !app.requestSingleInstanceLock()) {
  app.quit();
  // app.quit() is async — process.exit ensures we never reach createWindow in the duplicate.
  process.exit(0);
}

function focusMainWindow() {
  if (!win) return;
  if (win.isMinimized()) win.restore();
  if (!win.isVisible()) win.show();
  win.focus();
}

app.on('second-instance', () => {
  focusMainWindow();
});

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: APP_ICON,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: isDevelopment,
      backgroundThrottling: false,
    },
  });

  // Every fresh page load (boot, logout reload, 401 redirect) wipes the
  // renderer state that drives the timer IPC, so start detection from a clean
  // slate — the renderer re-sends 'timer-started' once it has re-fetched an
  // active attendance.
  win.webContents.on('did-finish-load', () => {
    idleDetector.stop();
    void maybePromptForNotificationPermission();
  });

  // On macOS the app outlives its window; without a renderer there is nobody
  // to pause/resume the timer, so stop watching until a new window syncs up.
  win.on('closed', () => {
    win = null;
    idleDetector.stop();
  });

  if (!isDevelopment) {
    win.webContents.on('before-input-event', (event, input) => {
      const key = input.key.toLowerCase();
      const ctrlOrCmd = input.control || input.meta;

      // The app menu is removed in production Menu.setApplicationMenu(null); which also strips the default
      // reload accelerator, so wire Ctrl/Cmd+R up manually to keep reload working.
      if (ctrlOrCmd && key === 'r' && input.type === 'keyDown') {
        event.preventDefault();
        win.webContents.reload();
        return;
      }
      const pressedF12 = key === 'f12';
      const devToolsShortcut = ctrlOrCmd && (input.alt || input.shift) && (key === 'i' || key === 'j' || key === 'c');

      const viewSource = ctrlOrCmd && key === 'u';
      if (pressedF12 || devToolsShortcut || viewSource) {
        event.preventDefault();
      }
    });

    Menu.setApplicationMenu(null);
    win.webContents.on('context-menu', event => event.preventDefault());
  }

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

function showNotification(title, body) {
  if (!Notification.isSupported()) return;

  const notification = new Notification({
    title,
    body,
    icon: NOTIFICATION_ICON,
    silent: false,
    urgency: 'normal',
  });

  // A Notification stops emitting 'click' once it is garbage collected, which is
  // why clicking an older notification in Notification Center did nothing while
  // the newest one still worked. Holding a reference until it is closed or clicked
  // keeps every notification clickable for as long as the OS shows it.
  const liveNotifications = new Set();

  liveNotifications.add(notification);
  const release = () => liveNotifications.delete(notification);

  notification.on('failed', error => {
    writeStartupLog(`Notification failed: ${error}`);
    release();
  });
  notification.on('close', release);
  notification.on('click', () => {
    focusMainWindow();
    release();
  });
  notification.show();
}

// On macOS, the OS-level "Allow notifications?" dialog only appears when the app
// first tries to show a notification. Firing a welcome notification surfaces
// that prompt automatically, so the user doesn't have to enable notifications
// manually from System Settings. We skip it when permission is already
// 'granted' so users who already accepted don't see a redundant notification on
// every launch. Notification.permission is read from the renderer because that
// is where the web Notification API reflects the live OS authorization state.
async function maybePromptForNotificationPermission() {
  if (!Notification.isSupported() || !win) return;

  let permission;
  try {
    permission = await win.webContents.executeJavaScript('Notification.permission');
  } catch (error) {
    writeStartupLog(`Could not read Notification.permission: ${error}`);
    return;
  }

  if (permission === 'granted') return;

  showNotification(APP_NAME, 'Allow notifications so the timer can alert you when it pauses on idle and resumes on activity.');
}

const idleDetector = createIdleDetector({
  onIdle: ({ idleSeconds }) => {
    console.log(`User is idle for ${idleSeconds} seconds`);
    win?.webContents.send('user-idle', { idleSeconds });
    showNotification('Timer Paused', 'The timer has been paused due to inactivity.');
  },
  onActive: ({ idleSeconds }) => {
    console.log('User is active again');
    win?.webContents.send('user-active', { idleSeconds });
  },
});

ipcMain.on('timer-started', () => {
  console.log('Timer started');
  idleDetector.start();
});

ipcMain.on('timer-stopped', () => {
  console.log('Timer stopped');
  idleDetector.stop();
});

ipcMain.on('timer-paused', () => {
  console.log('Timer paused');
  idleDetector.pause();
});

ipcMain.handle('get-system-idle-seconds', () => powerMonitor.getSystemIdleTime());

// The idle-threshold argument only affects the idle/active distinction; the
// 'locked' state is returned regardless, so any value works here.
ipcMain.handle('is-screen-locked', () => powerMonitor.getSystemIdleState(1) === 'locked');

// Lets the renderer re-fire the welcome notification on demand (e.g. a "Test
// notifications" button), which is the only way to re-surface the macOS
// permission prompt without sending the user into System Settings.
ipcMain.handle('request-notification-permission', async () => {
  if (!Notification.isSupported()) return { supported: false };
  await maybePromptForNotificationPermission();
  return { supported: true };
});

ipcMain.handle('open-location-settings', async () => {
  if (process.platform === 'darwin') {
    await shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_LocationServices');
    return;
  }

  if (process.platform === 'win32') {
    await shell.openExternal('ms-settings:privacy-location');
    return;
  }

  const settings = spawn('gnome-control-center', ['privacy', 'location'], {
    detached: true,
    stdio: 'ignore',
  });
  settings.on('error', () => {
    void shell.openExternal('settings://privacy/location').catch(() => {});
  });
  settings.unref();
});

ipcMain.on('show-notification', (_event, payload) => {
  showNotification(payload?.title ?? APP_NAME, payload?.body ?? '');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  // if (process.platform === 'darwin' && app.dock) app.dock.setIcon(APP_ICON);
  createWindow();
});
