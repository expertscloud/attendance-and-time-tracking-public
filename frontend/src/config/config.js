export const config = {
  frontendUrl: import.meta.env.VITE_FRONTEND_URL,
  backendUrl: import.meta.env.VITE_BACKEND_URL,
  dateFormat: 'ddd, MMM D, YYYY',
  timeFormat: 'h:mm A',
  idleThresholdSeconds: 300,
  syncWorkedTimeIntervalInMs: 60000, // 60s
  monitoringSnapshotIntervalMs: 3600000, // 1 hour
  idleCheckIntervalMs: 1000,
  currentAttendanceIntervalInMS: 60000, // 60s
  pauseReminderIntervalInMs: 300000, // 5 minutes
  appVersion: 'v1.0.4',
};
