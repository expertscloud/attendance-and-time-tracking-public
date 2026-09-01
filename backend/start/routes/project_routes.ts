import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ProjectsController = () => import('#controllers/project_controller')
const AttendanceController = () => import('#controllers/attendance_controller')

router
  .group(() => {
    router.post('/', [ProjectsController, 'create'])
    router.patch('/:projectId', [ProjectsController, 'update'])
    router.delete('/:projectId', [ProjectsController, 'delete'])

    router.get('/:projectId', [ProjectsController, 'show'])
    router.post('/listing', [ProjectsController, 'listing'])
  })
  .prefix('api/projects')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/projects/assigned', [AttendanceController, 'getAssignedProjects'])
    router.get('/projects/all', [AttendanceController, 'getAllProjects'])
  })
  .prefix('/api/attendance')
  .use(middleware.auth())
