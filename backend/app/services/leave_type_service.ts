import LeaveType from '#models/leave_type'
import { softDelete } from '#helpers/soft_delete_helper'
import {
  createLeaveTypeValidatorInterface,
  updateLeaveTypeValidatorInterface,
} from '#validators/leave_type_validator'

export const getAllLeaveTypes = async () => {
  return await LeaveType.query().whereNull('deleted_at')
}

export const createLeaveType = async (payload: createLeaveTypeValidatorInterface) => {
  return await LeaveType.create(payload)
}

export const updateLeaveType = async (id: number, payload: updateLeaveTypeValidatorInterface) => {
  const leaveType = await LeaveType.query().whereNull('deleted_at').where('id', id).firstOrFail()
  leaveType.merge(payload)
  await leaveType.save()
  return leaveType
}

export const deleteLeaveType = async (id: number) => {
  const leaveType = await LeaveType.query().whereNull('deleted_at').where('id', id).firstOrFail()
  await softDelete(leaveType)
  return leaveType
}
