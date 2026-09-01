import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
    router.get('/me', [AuthController, 'getUserByToken']).use([middleware.auth()])
    router
      .patch('user/change-password', [AuthController, 'changePassword'])
      .use([middleware.auth()])
    router.post('forgot-password', [AuthController, 'forgotPassword'])
    router.post('verify-forgot-password', [AuthController, 'verifyOtpForgotPassword'])
    router.post('reset-password', [AuthController, 'forgotPasswordAllowReset'])
  })
  .prefix('auth')
