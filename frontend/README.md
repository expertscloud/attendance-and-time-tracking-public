# Tickly — Employee Desktop App

A cross-platform **Electron + React** desktop app that lets employees clock in for the day, track time against projects, and have idle periods detected and excluded automatically. It's the employee-facing client of the wider Tickly platform — see the [root README](../README.md) for the backend and admin panel.

---

## What this app does

- **Daily attendance** — employees sign in, then **Check In** to start their workday and **Check Out** to end it. The current day's status is always one of `Not Started`, `Active`, `Paused`, or `Completed`.
- **Live work timer** — once checked in, a HH:MM:SS counter ticks in real time so the user can see exactly how long they've been working. Worked time is synced to the backend every couple of minutes so nothing is lost.
- **Project-based time tracking** — every minute of work is attributed to a project. The user picks from projects assigned to them (or any other project in the org), can add notes for context, and can **switch projects mid-session** without checking out — the app closes the previous segment and starts a new one tied to the new project. The last selected project and notes are restored on next sign-in.
- **Create new projects** — users can add a new project on the fly from the timer screen.
- **Manual Pause / Resume** — short breaks can be logged without ending the day. Pause time is tracked separately from work time.
- **Automatic idle detection** — if the user stops using their keyboard and mouse for 5 minutes, the timer pauses on its own and a desktop notification is shown. The moment they touch the keyboard or mouse again, the timer resumes and a "Welcome back" notification is shown with how long they were away. Idle time is never counted as work. (Uses the OS-level idle counter via Electron's `powerMonitor` — no extra permissions required.)
- **Activity timeline** — a chart on the dashboard shows the day laid out hour by hour, with green bars for working periods and amber bars for paused / idle periods, so the user can see their day at a glance. It updates live while working.
- **Attendance history** — a rolling view of recent days showing per-day check-in / check-out times plus a proportional work-vs-pause breakdown bar.
- **End-of-day summary** — after Check Out, the dashboard shows total time worked, total pause time, and check-in and check-out timestamps.
- **Employee profile** — the dashboard displays the signed-in employee's details: name, employee ID, designation, employment type, work mode, joining date, contact info, and avatar.
- **Resilient to restarts** — if the app or computer is restarted while the timer is running, the app restores the in-progress session on next launch so no time is lost.
- **Single instance** — only one copy of the app can run at a time; launching it again just focuses the existing window.

---

## Tech stack

- **React 19** with **Material-UI 9** and Emotion for the UI
- **Electron 39** for the desktop shell — `powerMonitor` for idle detection, native notifications, and single-instance lock
- **Redux Toolkit** for client state and **TanStack Query** for server state / caching
- **Recharts** for the activity timeline, **Axios** for API calls, **Formik + Yup** for forms
- **Vite** build tooling; packaged for macOS, Windows, and Linux via **electron-builder**

---

## Running locally

```bash
cd frontend
cp .env.example .env          # then point VITE_BACKEND_URL at your running backend
npm install
npm run dev                   # opens the Electron window against the Vite dev server
```

Other useful scripts:

```bash
npm run dev:electron          # Vite dev server without --host
npm run build                 # build the web bundle and package the desktop app (native OS)
npm run build:dir             # package unpacked (faster, for local testing)
npm run lint                  # ESLint
npm run format                # Prettier
```

Build Linux + Windows installers via Docker (from `frontend/`):

```bash
cp .env.release.example .env.release   # edit VITE_BACKEND_URL if needed
docker build -f Dockerfile.release -t my-release-image .
docker run --rm --env-file .env.release -v ./release:/app/release my-release-image
```

Installers land in `release/`. Install instructions are printed in the terminal.

macOS must be built on a Mac — see [INSTALL.md](../INSTALL.md).
