import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const GeneralController = () => import('#controllers/generals_controller')

router
  .group(() => {
    router.get('/app-version', [GeneralController, 'getAppVersion']).use([middleware.auth()])
  })
  .prefix('api')
