import type { HttpContext } from '@adonisjs/core/http'
import {
  getAllLeaveTypes,
  createLeaveType as createLeaveTypeService,
  updateLeaveType as updateLeaveTypeService,
  deleteLeaveType as deleteLeaveTypeService,
} from '#services/leave_type_service'
import {
  createLeaveTypeValidator,
  updateLeaveTypeValidator,
} from '#validators/leave_type_validator'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'

export default class LeaveTypesController {
  async index(ctx: HttpContext): Promise<void> {
    try {
      const leaveTypes = await getAllLeaveTypes()
      return sendSuccess('Leave types fetched successfully', leaveTypes)
    } catch (error) {
      console.log('Error in index leave types controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async create(ctx: HttpContext): Promise<void> {
    try {
      const payload = await createLeaveTypeValidator.validate(ctx.request.body())
      const created = await createLeaveTypeService(payload)
      return sendSuccess('Leave type created successfully', created)
    } catch (error) {
      console.log('Error in create leave type controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async update(ctx: HttpContext): Promise<void> {
    try {
      const payload = await updateLeaveTypeValidator.validate(ctx.request.body())
      const updated = await updateLeaveTypeService(ctx.params.id, payload)
      return sendSuccess('Leave type updated successfully', updated)
    } catch (error) {
      console.log('Error in update leave type controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async delete(ctx: HttpContext): Promise<void> {
    try {
      const deleted = await deleteLeaveTypeService(ctx.params.id)
      return sendSuccess('Leave type deleted successfully', deleted)
    } catch (error) {
      console.log('Error in delete leave type controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
