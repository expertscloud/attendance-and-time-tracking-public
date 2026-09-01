import { BaseEvent } from '@adonisjs/core/events'

export default class ForgotPasswordConfirmationEvent extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(public event: any) {
    super()
  }
}
