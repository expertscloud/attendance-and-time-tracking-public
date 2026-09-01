export const config = {
  frontendUrl: import.meta.env.VITE_FRONTEND_URL,
  backendUrl: import.meta.env.VITE_BACKEND_URL,
  dateFormat: 'D-M-YYYY',
  timeFormat: 'h:mm a',
  defaultPageSize: 30,
  attendanceUpdateThresholdInMinutes: 30,
  warningShortDayHours: 4,   // Worked under this many hours → red highlight
  mildShortDayHours: 6,      // Worked under this many hours → orange highlight
};
