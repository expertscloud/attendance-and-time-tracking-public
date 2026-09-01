import { BaseMail } from '@adonisjs/mail'
import { EmailInterface } from '#interfaces/email_base_interface'
import { emailConfig } from '#config/services'

export default class UserForgotPasswordEmail extends BaseMail {
  from = ''
  subject = ''
  data: EmailInterface

  constructor(data: EmailInterface) {
    super()
    this.data = data
    this.from = emailConfig.from
    this.subject = this.data.subject
  }

  prepare() {
    const { to, bcc, cc } = this.data

    this.message
      .to(to)
      .bcc(bcc || [])
      .cc(cc || [])
      .htmlView('emails/user_forgot_password_email', this.data)
  }
}
