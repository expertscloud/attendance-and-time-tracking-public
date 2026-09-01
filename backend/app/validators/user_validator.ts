import { imageExtnames } from '#config/services'
import { designationEnums, employmentTypeEnums, workModeEnums } from '#enums/master_enum'
import { UserTypeEnum } from '#enums/user_type_enum'
import User from '#models/user'
import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

const userDetailFields = {
  employeeId: vine.number().optional(),
  phoneNumber: vine.string().trim().maxLength(255).optional(),
  emergencyContactNumber: vine.string().trim().maxLength(255).optional(),
  dob: vine.date().optional(),
  joiningDate: vine.date().optional(),
  gender: vine.number().optional(),
  address: vine.string().trim().optional(),
}

export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(3).maxLength(64).trim(),
    email: vine.string().email().trim().unique({
      table: User.table,
      column: 'email',
    }),
    password: vine.string().trim(),
    isActive: vine.boolean(),
    employmentType: vine
      .string()
      .in(Object.values(employmentTypeEnums).map((item) => item.id.toString()))
      .transform((value) => Number(value)),
    designation: vine
      .string()
      .in(Object.values(designationEnums).map((item) => item.id.toString()))
      .transform((value) => Number(value)),

    workMode: vine
      .string()
      .in(Object.values(workModeEnums).map((item) => item.id.toString()))
      .transform((value) => Number(value)),
    ...userDetailFields,
  })
)

export type createUserValidatorInterface = Infer<typeof createUserValidator>

export const updateUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .trim()
      .unique(async (db, value, field) => {
        const user = await db
          .from(User.table)
          .where('email', value)
          .whereNot('id', field.meta.userId)
          .first()

        // we check if the incoming email is not already exists with other ids, if not exists then we allow to change the email
        return !user
      }),
    fullName: vine.string().minLength(3).maxLength(64).trim(),
    isActive: vine.boolean().optional(),
    employmentType: vine
      .string()
      .in(Object.values(employmentTypeEnums).map((item) => item.id.toString()))
      .transform((value) => Number(value)),
    designation: vine
      .string()
      .in(Object.values(designationEnums).map((item) => item.id.toString()))
      .transform((value) => Number(value)),

    workMode: vine
      .string()
      .in(Object.values(workModeEnums).map((item) => item.id.toString()))
      .transform((value) => Number(value)),
    ...userDetailFields,
  })
)
export type updateUserValidatorInterface = Infer<typeof updateUserValidator>

export const updateUserRoleValidator = vine.compile(
  vine.object({
    type: vine.number().in(Object.values(UserTypeEnum)),
  })
)

export type updateUserRoleValidatorInterface = Infer<typeof updateUserRoleValidator>

export const userIdValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
  })
)
export type userIdValidatorInterface = Infer<typeof userIdValidator>

export const userStatsQueryValidator = vine.compile(
  vine.object({
    startDate: vine.date().optional(),
    endDate: vine.date().optional(),
  })
)
export type userStatsQueryValidatorInterface = Infer<typeof userStatsQueryValidator>

export const userActivitiesQueryValidator = vine.compile(
  vine.object({
    date: vine.date(),
  })
)
export type userActivitiesQueryValidatorInterface = Infer<typeof userActivitiesQueryValidator>

export const userAttendanceQueryValidator = vine.compile(
  vine.object({
    startDate: vine.date(),
    endDate: vine.date(),
  })
)
export type userAttendanceQueryValidatorInterface = Infer<typeof userAttendanceQueryValidator>

export const imageValidator = vine.compile(
  vine.object({
    image: vine.file({ extnames: imageExtnames }).optional(),
  })
)

export type ImageValidatorType = Infer<typeof imageValidator>
