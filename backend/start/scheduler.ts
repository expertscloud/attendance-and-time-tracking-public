import { CronJob } from 'cron'
import {
  autoCheckoutUsersWhoDidNotCheckOut,
  trackUsersWhoAreOffline,
} from '#services/attendance_service'
import { AUTO_CHECKOUT_CRON_SCHEDULE, TRACK_OFFLINE_USERS_CRON_SCHEDULE } from '#config/services'
import { DateTime } from 'luxon'

declare global {
  var autoCheckoutCronJob: CronJob | undefined
  var pauseOfflineUsersCronJob: CronJob | undefined
}

if (!global.autoCheckoutCronJob) {
  global.autoCheckoutCronJob = new CronJob(
    AUTO_CHECKOUT_CRON_SCHEDULE,
    async () => {
      try {
        console.log(`\n\nCron Job START: ${DateTime.now().toSQL()} \n\n`)
        await autoCheckoutUsersWhoDidNotCheckOut()

        console.log(`\n\nCron Job END: ${DateTime.now().toSQL()} \n\n`)
      } catch (error) {
        console.error('Auto checkout cron failed:', error)
      }
    },
    null,
    true
  )
}

if (!global.pauseOfflineUsersCronJob) {
  global.pauseOfflineUsersCronJob = new CronJob(
    TRACK_OFFLINE_USERS_CRON_SCHEDULE,
    async () => {
      try {
        await trackUsersWhoAreOffline()
      } catch (error) {
        console.error('Pause offline users cron failed:', error)
      }
    },
    null,
    true
  )
}
