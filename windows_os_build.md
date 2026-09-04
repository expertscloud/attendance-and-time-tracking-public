# Windows — build on Windows

Docker release already builds `.exe` on Linux via Wine. Use these steps if you prefer to build natively on Windows.

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
