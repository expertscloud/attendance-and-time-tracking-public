import { config } from '../src/config/config';
import { powerMonitor } from 'electron';

// Idle detection built solely on powerMonitor.getSystemIdleTime() — the OS
// counter of seconds since the last keyboard/mouse input. It resets to 0 on
// any interaction

export function createIdleDetector({ onIdle, onActive }) {
  const { idleThresholdSeconds, idleCheckIntervalMs } = config;

  let pollTimer = null;
  let idleSince = null; // set while we are waiting for the user to come back

  function stop() {
    clearInterval(pollTimer);
    pollTimer = null;
    idleSince = null;
  }

  function poll() {
    const idleSeconds = powerMonitor.getSystemIdleTime();

    if (idleSince === null) {
      if (idleSeconds >= idleThresholdSeconds) {
        idleSince = Date.now() - idleSeconds * 1000;
        onIdle({ idleSeconds });
      }
      return;
    }

    // While the screen is locked the idle counter can reset without the user
    // being back (e.g. the display waking to show our own pause notification),
    // so only an unlocked session counts as a return.
    if (idleSeconds < idleThresholdSeconds && powerMonitor.getSystemIdleState(idleThresholdSeconds) !== 'locked') {
      // idle user has come back
      const awaySeconds = Math.floor((Date.now() - idleSince) / 1000);
      stop(); // the watch restarts via start() once the timer resumes
      onActive({ idleSeconds: awaySeconds });
    }
  }

  return {
    // Timer is running (started or resumed): watch for inactivity.
    start() {
      idleSince = null;
      if (!pollTimer) pollTimer = setInterval(poll, idleCheckIntervalMs);
    },

    // Timer paused. After an idle-triggered pause keep polling so we can
    // detect the user's return; after a manual pause there is nothing to watch.
    pause() {
      if (idleSince === null) stop();
    },

    stop,
  };
}
