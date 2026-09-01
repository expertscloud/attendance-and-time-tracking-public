import WelcomeEmailEvent from '#events/welcome_email_event'
import { WelcomeEmailSendEvent } from '#interfaces/email_event_interface'
import ForgotPasswordConfirmationEmail from '#mails/forgot_password_confirmation_email'
import UserForgotPasswordEmail from '#mails/user_forgot_password_email'
import WelcomeEmail from '#mails/welcome_email'
import mail from '@adonisjs/mail/services/main'

export const dispatchWelcomeEmail = async () => {
  try {
    WelcomeEmailEvent.dispatch({
      to: 'test.com',
      userEmail: 'test@test.com',
    })
  } catch (error) {
    console.log('dispatchWelcomeEmail Error:', error)
  }
}

export const sendWelcomeEmail = async (payload: WelcomeEmailSendEvent) => {
  try {
    await mail.send(
      new WelcomeEmail({
        to: payload.event.to,
        data: { userEmail: payload.event.userEmail },
        subject: 'Welcome Email',
      })
    )
  } catch (error) {
    console.log('sendWelcomeEmail Error:', error)
  }
}

export const sendForgotPasswordEmail = async (payload: any) => {
  try {
    await mail.send(
      new UserForgotPasswordEmail({
        to: payload.event.user.email,
        data: {
          user: payload.event.user,
          userVerification: payload.event.userVerification,
          frontendBaseUrl: payload.event.frontendBaseUrl,
        },
        subject: 'Reset Your Password',
      })
    )
  } catch (error: any) {
    console.log('sendForgotPasswordEmail Error:', error)
  }
}

export const sendForgotPasswordConfirmationEmail = async (payload: any) => {
  try {
    await mail.send(
      new ForgotPasswordConfirmationEmail({
        to: payload.event.email,
        data: {
          fullName: payload.event.fullName,
          email: payload.event.email,
          frontendBaseUrl: payload.event.frontendBaseUrl,
        },
        subject: 'Password Changed Successfully',
      })
    )
  } catch (error: any) {
    console.log('sendForgotPasswordConfirmationEmail Error:', error)
  }
}
