import env from '#start/env'

export const emailCompanyLogo = 'https://c.........../dd-editor/templates/top-news/brand.png'

export const emailConfig = {
  from: env.get('SMTP_FROM', 'noreply@example.com'),
}

export const AUTO_CHECKOUT_CRON_SCHEDULE = '0 0 * * *' // 12 AM utc every day, 5am in Pakistan

// How long without a worked-time sync before an active session is treated as
// offline (app closed / device off or asleep).
export const OFFLINE_THRESHOLD_IN_SEC = 300 // 5 min

export const MINIMUM_WORKING_HOURS_IN_SECONDS = 6 * 3600 // 6 hours

// How often the server checks for active sessions that have gone offline (see
// trackUsersWhoAreOffline) and records them as 'away'. Runs independently of any
// client request.
export const TRACK_OFFLINE_USERS_CRON_SCHEDULE = '*/1 * * * *' // every 1 minute

export const imageExtnames = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'gif',
  'bmp',
  'tiff',
  'tif',
  'svg',
  'ico',
  'avif',
  'heic',
  'heif',
  'jfif',
]

export const profileConfig = {
  expiresIn: env.get('AWS_S3_SIGNED_URL_EXPIRY_DAYS', '2 days'),
}

export const otpConfig = {
  OTP_EXPIRES_TIME_IN_SEC: env.get('OTP_EXPIRES_TIME_IN_SEC', 300), // 5min
}

export const frontendBaseUrl = env.get('FRONTEND_BASE_URL')

export const appVersion = 'v1.0.4'
