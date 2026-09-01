import emitter from '@adonisjs/core/services/emitter'
import {
  sendForgotPasswordConfirmationEmail,
  sendForgotPasswordEmail,
  sendWelcomeEmail,
} from '#services/email_service'
import WelcomeEmailEvent from '#events/welcome_email_event'
import UserForgotPasswordEvent from '#events/user_forgot_password_event'
import ForgotPasswordConfirmationEvent from '#events/forgot_password_confirmation_event'

emitter.on(WelcomeEmailEvent, async (data: any) => {
  await sendWelcomeEmail(data)
})

emitter.on(UserForgotPasswordEvent, async (data: any) => {
  await sendForgotPasswordEmail(data)
})

emitter.on(ForgotPasswordConfirmationEvent, async (data: any) => {
  await sendForgotPasswordConfirmationEmail(data)
})
