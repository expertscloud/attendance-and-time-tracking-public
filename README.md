# Tickly

An employee **attendance and time-tracking platform**. Employees clock in for the day on a cross-platform desktop app that tracks their work against projects and automatically detects idle time, while administrators manage people, projects, and clients — and review everyone's hours — from a web dashboard. Both apps are powered by a single AdonisJS API.

---

## What this platform does

At its core, the platform answers three questions for an organization:

1. **Who is working, and when?** — daily check-in / check-out with a live work timer.
2. **What are they working on?** — every minute of work is attributed to a project.
3. **How much real work happened?** — idle time and breaks are detected and excluded automatically.

It is made up of three parts:

| Component                               | Audience    | What it is                                                               |
| --------------------------------------- | ----------- | ------------------------------------------------------------------------ |
| **Backend API** (`backend/`)            | —           | AdonisJS 6 + MySQL REST API; the single source of truth.                 |
| **Employee Desktop App** (`frontend/`)  | Employees   | Electron + React app for daily attendance and time tracking.             |
| **Admin Web Panel** (`admin-frontend/`) | Admins / HR | React web app to manage users, projects, clients, and review attendance. |

---

## Employee Desktop App

The day-to-day app every employee runs on their machine.

- **Daily attendance** — sign in, then **Check In** to start the workday and **Check Out** to end it. The current day's status is always one of `Not Started`, `Active`, `Paused`, or `Completed`.
- **Live work timer** — a real-time HH:MM:SS counter shows exactly how long you've been working. Worked time is synced to the backend periodically so nothing is lost.
- **Project-based time tracking** — every work segment is attributed to a project. Pick from projects assigned to you or any project in the org, add notes for context, and **switch projects mid-session** without checking out — the app closes the previous segment and opens a new one.
- **Create projects on the fly** — add a new project directly from the timer screen.
- **Manual Pause / Resume** — log short breaks without ending the day. Pause time is tracked separately from work time.
- **Automatic idle detection** — if there's no keyboard or mouse activity for 5 minutes, the timer pauses on its own and a desktop notification appears. Touch the keyboard or mouse again and it resumes with a "Welcome back" notification showing how long you were away. Idle time is never counted as work. (Uses the OS-level idle counter via Electron's `powerMonitor` — no extra permissions required.)
- **Activity timeline** — a chart lays the day out hour by hour: green bars for working periods, amber for paused / idle, with project names on hover.
- **Attendance history** — a rolling view of the last several days with per-day check-in/out times and a proportional work-vs-pause breakdown.
- **End-of-day summary** — after checkout, see total time worked, total pause time, and check-in/check-out timestamps.
- **Employee profile** — name, employee ID, designation, employment type, work mode, joining date, contact info, and avatar.
- **Resilient & single-instance** — restores an in-progress session after an app or machine restart, and only one copy can run at a time.

**Stack:** React 19, Electron 39, Material-UI 9, Redux Toolkit, TanStack Query, Recharts, Axios, Vite. Builds for macOS, Windows, and Linux via electron-builder.

---

## Admin Web Panel

The management console for HR / admins.

- **Authentication** — sign in / sign up, plus email-based forgot-password and reset-password flows.
- **Employee management** — full CRUD over employees with rich profiles (designation, employment type, work mode, employee ID, contact details, joining date, profile photo). Search, filter, paginate, and toggle active/inactive.
- **Employee analytics** — a per-user dashboard with avg daily hours (7-day / 30-day), total days worked, and an area chart of daily hours over a selectable range (1W–1Y).
- **Project management** — CRUD over projects: link to a client, assign a team lead and team members, set status (Planning, In Progress, On Hold, Completed, Cancelled), mark billable, and track start / planned-end / actual-end dates.
- **Client management** — CRUD over clients with full contact and address details.
- **Attendance review** — a matrix of every user's attendance across a chosen date range (check-in, check-out, total hours, status) for at-a-glance oversight.

**Stack:** React 19, Material-UI 9, AG-Grid, Redux Toolkit, TanStack Query, Recharts, Formik + Yup, Axios, Vite.

---

## Backend API

The AdonisJS service that both apps talk to.

**Domain model:** `Users` (with extended `UserDetails`) → `Attendances` → `TimeEntries` (work/pause segments, each optionally tied to a project). `Clients` → `Projects` → `ProjectMembers`, with a team lead per project. `AttendanceProjects` records which projects were active during each attendance. `Files` stores profile-photo metadata.

**Feature areas:**

- **Auth** — token-based registration, login, and `me`, with 30-day access tokens and scrypt password hashing.
- **Attendance & time tracking** — check-in / check-out, pause / resume (including auto-idle pauses), switch-project, worked-time sync, and "current"/"recent"/"last activity" lookups.
- **Reporting & analytics** — per-user attendance stats over a date range, day-by-day activity breakdowns, and bulk attendance fetch for all users (powers the admin matrix).
- **Project & client management** — CRUD plus paginated, filterable, sortable listings; project membership and team-lead assignment.
- **File storage** — profile-photo uploads to **AWS S3** with signed URLs.
- **Email** — event-driven SMTP email (e.g. welcome emails) with MJML templates.
- **Automated checkout** — a daily cron job auto-closes any attendance left open by regular employees.

**Roles:** **SuperAdmin** (full access, full project detail) and **Regular User** (employee; limited project visibility). Job designations, employment types, and work modes are enumerated (e.g. Intern → Project Manager; Intern → Freelancer; On-Site / Remote / Hybrid).

**Stack:** AdonisJS 6, TypeScript, Lucid ORM, MySQL 8, VineJS validation, Luxon, AWS S3 (`@adonisjs/drive`), `@adonisjs/mail` + MJML, node-cron. Soft deletes throughout.

---

## Architecture at a glance

```
                +------------------------+
                |   Backend API          |
   Employee     |   AdonisJS 6 + MySQL   |     Admin
   Desktop App  |   S3 · SMTP · cron     |     Web Panel
  (Electron) ---+------------------------+--- (React/Vite)
                          ^
                          |
                  token-based REST
```

Both clients are thin: the desktop app drives the timer and idle detection locally but persists everything through the API; the admin panel is a management UI over the same data.


---

## Docker Compose (recommended quick start)

Runs **MySQL**, **Backend API**, **Admin panel**, and **Mailpit** (test email). Profile photos upload to **AWS S3**.

### Start everything

```bash
cp .env.example .env
# fill AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET
docker compose up --build
```

First run takes a few minutes to build images; later runs start in seconds.

### AWS S3 setup

Create an S3 bucket and IAM access keys, then put them in the root `.env`:

| Variable | Example |
|----------|---------|
| `AWS_ACCESS_KEY_ID` | your IAM access key |
| `AWS_SECRET_ACCESS_KEY` | your IAM secret key |
| `AWS_REGION` | `us-east-1` |
| `S3_BUCKET` | your bucket name |
| `AWS_S3_SIGNED_URL_EXPIRY_DAYS` | `4 days` (optional) |

Leave `AWS_ENDPOINT` unset — that is only for local S3-compatible tools, not real AWS.

### URLs

| Service               | URL                   |
| --------------------- | --------------------- |
| Admin panel           | http://localhost:3000 |
| Backend API           | http://localhost:3333 |
| Test emails (Mailpit) | http://localhost:8025 |

### Default logins (created by seeders)

| Role     | Email                  | Password        | Use for         |
| -------- | ---------------------- | --------------- | --------------- |
| Admin    | `admin@example.com`    | `Admin@1234`    | Admin web panel |
| Employee | `employee@example.com` | `Employee@1234` | Desktop app     |

Seeders also create a **Demo Client**, **Demo Project**, and assign the employee to that project — no manual setup needed.

### What runs automatically

- **mysql** — database (persisted in a Docker volume)
- **backend** — migrations, seed data (admin, employee, sample project), then API on port 3333
- **admin** — admin web UI on port 3000
- **mailpit** — catches password-reset and other emails for local testing
- **AWS S3** — profile-photo storage (configured via root `.env`)

The **employee desktop app** is not in Docker — build it separately (see below) and point it at `http://localhost:3333`.

---

## Desktop app (employee Electron app)

Build **Linux + Windows installers** with Docker — no Compose needed.

```bash
cd frontend
cp .env.release.example .env.release   # edit VITE_BACKEND_URL if needed
docker build -f Dockerfile.release -t my-release-image .
docker run --rm --env-file .env.release -v ./release:/app/release my-release-image
```

- Builds `.deb` + `.AppImage` (Linux) and `.exe` (Windows) into `frontend/release/`
- Prints install instructions in the terminal when done


### Google Maps / Geolocation key (`VITE_GOOGLE_API_KEY`)

Needed for **location tracking on Windows and Linux** installers (macOS uses native CoreLocation and does not need this key).

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable **Geolocation API** (APIs & Services → Library → search “Geolocation API” → Enable)
4. Create an API key (APIs & Services → Credentials → Create credentials → API key)
5. Paste the key into `frontend/.env.release` as `VITE_GOOGLE_API_KEY=...`
6. Rebuild the Docker release image so the key is baked into the app

If you leave `VITE_GOOGLE_API_KEY` empty, the app still builds, but geolocation will not work on Windows/Linux.

| Platform            | How to build                                      |
| ------------------- | ------------------------------------------------- |
| **Linux + Windows** | Docker commands above                             |
| **macOS**           | See [macos_build.md](macos_build.md)              |
| **Windows (native)**| See [windows_os_build.md](windows_os_build.md)    |
