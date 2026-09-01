import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('#controllers/user_controller')

router
  .group(() => {
    router.post('/', [UsersController, 'create'])
    router.patch('/:userId', [UsersController, 'update'])
    router.delete('/:userId', [UsersController, 'delete'])

    router.patch('/:userId/role', [UsersController, 'updateRole']).use([middleware.auth()])

    router.post('/attendances', [UsersController, 'attendances'])
    router.get('/attendance/today', [UsersController, 'todayAttendance'])
    router.post('/listing', [UsersController, 'listing'])
    router.get('/locations', [UsersController, 'locations'])
    router.get('/:userId/stats', [UsersController, 'stats'])
    router.get('/:userId/activities', [UsersController, 'activities'])
    router.get('/:userId', [UsersController, 'show'])
  })
  .prefix('api/users')
