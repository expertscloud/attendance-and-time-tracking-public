import Leave from '#models/leave'
import User from '#models/user'
import LeaveType from '#models/leave_type'
import { leaveTypeEnums } from '#enums/leave_enum'
import { UserTypeEnum } from '#enums/user_type_enum'
import { DateTime } from 'luxon'
import {
  createLeaveValidatorInterface,
  createBulkLeaveValidatorInterface,
  leaveSummaryValidatorInterface,
} from '#validators/leave_validator'

export const createOrUpdateLeave = async (payload: createLeaveValidatorInterface) => {
  const leaveDateTime = DateTime.fromJSDate(payload.date)
  const dateString = leaveDateTime.toISODate()!

  const existingLeave = await Leave.query()
    .where('user_id', payload.userId)
    .where('date', dateString)
    .first()

  if (existingLeave) {
    existingLeave.leaveType = payload.leaveType
    existingLeave.reason = payload.reason ?? null
    await existingLeave.save()
    return existingLeave
  }

  return await Leave.create({
    userId: payload.userId,
    date: leaveDateTime,
    leaveType: payload.leaveType,
    reason: payload.reason ?? null,
  })
}

export const createOrUpdateBulkLeave = async (payload: createBulkLeaveValidatorInterface) => {
  const leaveDateTime = DateTime.fromJSDate(payload.date)
  const dateString = leaveDateTime.toISODate()!

  const holidayType = await LeaveType.query()
    .whereNull('deleted_at')
    .where('id', leaveTypeEnums.HOLIDAY.id)
    .first()

  if (!holidayType) {
    throw new Error('Holiday type not found')
  }

  const users = await User.query()
    .whereNot('type', UserTypeEnum.superAdmin)
    .preload('leaves', (subQuery) => {
      subQuery.where('date', dateString)
    })

  return Promise.all(
    users.map(async (user) => {
      const existingLeave = user.leaves[0]

      if (existingLeave) {
        existingLeave.leaveType = holidayType.id
        existingLeave.reason = payload.reason
        return existingLeave.save()
      }

      return Leave.create({
        userId: user.id,
        date: leaveDateTime,
        leaveType: holidayType.id,
        reason: payload.reason,
      })
    })
  )
}

export const getLeavesSummary = async (payload: leaveSummaryValidatorInterface) => {
  const startDateStr = DateTime.fromJSDate(payload.startDate).toISODate()!
  const endDateStr = DateTime.fromJSDate(payload.endDate).toISODate()!

  const users = await User.query()

    .whereNot('type', UserTypeEnum.superAdmin)
    .where('is_active', true)
    .preload('leaves', (query) => {
      query.whereBetween('date', [startDateStr, endDateStr])
    })

  return users
}

export const getUserLeaves = async (userId: number, payload: leaveSummaryValidatorInterface) => {
  const startDateStr = DateTime.fromJSDate(payload.startDate).toISODate()!
  const endDateStr = DateTime.fromJSDate(payload.endDate).toISODate()!

  const leaves = await Leave.query()
    .where('user_id', userId)
    .whereBetween('date', [startDateStr, endDateStr])
    .orderBy('date', 'desc')

  return leaves
}
