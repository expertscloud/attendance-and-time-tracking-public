# Tickly — Install guide

After a Docker release build, Linux installers are in `frontend/release/`.

---

## Linux (Debian/Ubuntu) — built by Docker

```bash
sudo apt install ./frontend/release/Tickly-*-linux-amd64.deb
```

Launch from the app menu, or run: `tickly`

**Notifications (GNOME / Ubuntu 24.04+):** Settings → Notifications → enable popups → Applications → Tickly → turn all on.

**Auto-launch:** `sudo apt install gnome-startup-applications` if needed → Startup Applications → Add → Name: `Tickly`, Command: `tickly`.

---

## Linux (other distros) — AppImage (built by Docker)

```bash
chmod +x ./frontend/release/Tickly-*-linux-x86_64.AppImage
./frontend/release/Tickly-*-linux-x86_64.AppImage
```

Optional stable path + autostart:

```bash
mkdir -p ~/Applications ~/.config/autostart
mv ./frontend/release/Tickly-*-linux-x86_64.AppImage ~/Applications/tickly.AppImage
chmod +x ~/Applications/tickly.AppImage
```

---

## macOS — build on a Mac (Docker cannot build .dmg)

```bash
cd frontend
cp .env.example .env
# set VITE_BACKEND_URL in .env
npm install && npm run build
```

Output: `frontend/release/Tickly-*-mac-arm64.dmg` (Apple Silicon) or `Tickly-*-mac-x64.dmg` (Intel).

1. Open the matching `.dmg`
2. Drag **Tickly** into **Applications**
3. Run once: `xattr -cr "/Applications/Tickly.app"`
4. Launch from Applications / Launchpad

**Notifications:** System Settings → Notifications → Tickly → Allow → Persistent alerts.  
**Auto-launch:** System Settings → General → Login Items → **+** → Tickly.

---

## Windows — build on Windows (Docker cannot build .exe)

```bash
cd frontend
copy .env.example .env
rem set VITE_BACKEND_URL in .env
npm install && npm run build
```

Output: `frontend/release/Tickly-*-win-x64.exe`

1. Double-click the `.exe`
2. Follow the installer wizard

**Notifications:** Settings → System → Notifications → Tickly → On.  
**Auto-launch:** Settings → Apps → Startup → Tickly → On.

---

## API URL

The API URL is set in `.env.release` before you run Docker release.

```bash
cd frontend
cp .env.release.example .env.release
# edit VITE_BACKEND_URL
docker build -f Dockerfile.release -t my-release-image .
docker run --rm --env-file .env.release -v ./release:/app/release my-release-image
```
