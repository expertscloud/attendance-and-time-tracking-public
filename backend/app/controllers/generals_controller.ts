import type { HttpContext } from '@adonisjs/core/http'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'

import { appVersion } from '#config/services'

export default class GeneralsController {
  public async getAppVersion(ctx: HttpContext) {
    try {
      return sendSuccess('App version retrieved successfully', appVersion)
    } catch (error) {
      console.log('Error in retrieving app version', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
