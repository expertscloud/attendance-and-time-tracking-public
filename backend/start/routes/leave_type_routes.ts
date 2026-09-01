import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const LeaveTypesController = () => import('#controllers/leave_types_controller')

router
  .group(() => {
    router.get('/', [LeaveTypesController, 'index'])
    router.post('/', [LeaveTypesController, 'create'])
    router.put('/:id', [LeaveTypesController, 'update'])
    router.delete('/:id', [LeaveTypesController, 'delete'])
  })
  .prefix('/api/leave-types')
  .use(middleware.auth())
