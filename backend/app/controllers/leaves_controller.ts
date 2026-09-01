import type { HttpContext } from '@adonisjs/core/http'
import {
  createLeaveValidator,
  createBulkLeaveValidator,
  leaveSummaryValidator,
  getUserLeavesValidator,
} from '#validators/leave_validator'
import {
  createOrUpdateLeave,
  createOrUpdateBulkLeave,
  getLeavesSummary,
  getUserLeaves as getUserLeavesService,
} from '#services/leave_service'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'

export default class LeavesController {
  async create(ctx: HttpContext): Promise<void> {
    try {
      const payload = await createLeaveValidator.validate(ctx.request.body())
      const leave = await createOrUpdateLeave(payload)
      return sendSuccess('Leave saved successfully', leave)
    } catch (error) {
      console.log('Error in create leave controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async createBulk(ctx: HttpContext): Promise<void> {
    try {
      const payload = await createBulkLeaveValidator.validate(ctx.request.body())
      const leaves = await createOrUpdateBulkLeave(payload)
      return sendSuccess('Holiday saved successfully for all users', leaves)
    } catch (error) {
      console.log('Error in createBulk leave controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async getSummary(ctx: HttpContext): Promise<void> {
    try {
      const payload = await leaveSummaryValidator.validate(ctx.request.body())
      const summary = await getLeavesSummary(payload)
      return sendSuccess('Leaves summary fetched', summary)
    } catch (error) {
      console.log('Error in getSummary leave controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async getUserLeaves(ctx: HttpContext): Promise<void> {
    try {
      const { userId, startDate, endDate } = await getUserLeavesValidator.validate({
        ...ctx.params,
        ...ctx.request.qs(),
      })
      const result = await getUserLeavesService(userId, { startDate, endDate })
      return sendSuccess('User leaves fetched', result)
    } catch (error) {
      console.log('Error in getUserLeaves leave controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
