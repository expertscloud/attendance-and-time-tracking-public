import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const LeavesController = () => import('#controllers/leaves_controller')

router
  .group(() => {
    router.post('/', [LeavesController, 'create'])
    router.post('/bulk', [LeavesController, 'createBulk'])
    router.post('/summary', [LeavesController, 'getSummary'])
    router.get('/user/:userId', [LeavesController, 'getUserLeaves'])
  })
  .prefix('/api/leaves')
  .use(middleware.auth())
