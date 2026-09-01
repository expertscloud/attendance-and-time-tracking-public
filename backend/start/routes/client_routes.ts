import router from '@adonisjs/core/services/router'

const ClientsController = () => import('#controllers/client_controller')

router
  .group(() => {
    router.post('/', [ClientsController, 'create'])
    router.patch('/:clientId', [ClientsController, 'update'])
    router.delete('/:clientId', [ClientsController, 'delete'])

    router.get('/:clientId', [ClientsController, 'show'])
    router.post('/listing', [ClientsController, 'listing'])
  })
  .prefix('api/clients')
