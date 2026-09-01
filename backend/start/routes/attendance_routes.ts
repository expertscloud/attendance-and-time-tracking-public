import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AttendanceController = () => import('#controllers/attendance_controller')

router
  .group(() => {
    router.post('/check-in', [AttendanceController, 'checkIn'])
    router.post('/check-out', [AttendanceController, 'checkOut'])
    router.post('/pause', [AttendanceController, 'pauseTimer'])
    router.post('/resume', [AttendanceController, 'resumeTimer'])
    router.post('/start-new-task', [AttendanceController, 'startNewTask'])
    router.get('/recent/:limit', [AttendanceController, 'getRecentAttendances'])
    router.get('/current', [AttendanceController, 'getCurrentAttendance'])
    router.get('/last-work-activity', [AttendanceController, 'getLastWorkActivity'])
    router.post('/activities', [AttendanceController, 'getActivityStatsByDate'])
    router.get('/stats', [AttendanceController, 'getAttendanceStats'])
    router.post('/sync', [AttendanceController, 'syncWorkedTime'])
    router.post('/location-snapshots', [AttendanceController, 'createLocationSnapshot'])
  })
  .prefix('/api/attendance')
  .use(middleware.auth())
