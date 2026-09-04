# macOS — build on a Mac

Docker cannot build `.dmg` installers. Build on a Mac instead.

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
