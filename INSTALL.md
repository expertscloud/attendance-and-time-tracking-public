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

## macOS

See [macos_build.md](macos_build.md).

---

## Windows

See [windows_os_build.md](windows_os_build.md).

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
