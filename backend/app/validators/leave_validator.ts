import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import User from '#models/user'

export const createLeaveValidator = vine.compile(
  vine.object({
    userId: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        return await db.from(User.table).where('id', value).first()
      }),
    date: vine.date(),
    leaveType: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        return await db.from('leave_types').where('id', value).first()
      }),
    reason: vine.string().trim().nullable().optional(),
  })
)

export type createLeaveValidatorInterface = Infer<typeof createLeaveValidator>

export const createBulkLeaveValidator = vine.compile(
  vine.object({
    date: vine.date(),
    reason: vine.string().trim().minLength(1),
  })
)

export type createBulkLeaveValidatorInterface = Infer<typeof createBulkLeaveValidator>

export const leaveSummaryValidator = vine.compile(
  vine.object({
    startDate: vine.date(),
    endDate: vine.date(),
  })
)

export type leaveSummaryValidatorInterface = Infer<typeof leaveSummaryValidator>

export const getUserLeavesValidator = vine.compile(
  vine.object({
    userId: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        return await db.from(User.table).where('id', value).first()
      }),
    startDate: vine.date(),
    endDate: vine.date(),
  })
)

export type getUserLeavesValidatorInterface = Infer<typeof getUserLeavesValidator>
