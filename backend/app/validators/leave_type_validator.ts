import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const createLeaveTypeValidator = vine.compile(
  vine.object({
    label: vine.string().trim().minLength(1),
    allowance: vine.number().min(0),
    color: vine.string().trim().optional(),
  })
)

export type createLeaveTypeValidatorInterface = Infer<typeof createLeaveTypeValidator>

export const updateLeaveTypeValidator = vine.compile(
  vine.object({
    label: vine.string().trim().minLength(1).optional(),
    allowance: vine.number().min(0).optional(),
    color: vine.string().trim().optional(),
  })
)

export type updateLeaveTypeValidatorInterface = Infer<typeof updateLeaveTypeValidator>
