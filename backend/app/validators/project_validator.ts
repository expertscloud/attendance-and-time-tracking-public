import { projectStatusEnums } from '#enums/master_enum'
import Client from '#models/client'
import User from '#models/user'
import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const createProjectValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    shortCode: vine.string().trim().optional(),
    description: vine.string().trim().optional(),
    clientId: vine
      .number()
      .exists(async (db, value) => {
        return await db.from(Client.table).where('id', value).first()
      })
      .optional(),
    status: vine.enum(Object.values(projectStatusEnums).map((item) => item.id)).optional(),
    isBillable: vine.boolean().optional(),
    startDate: vine.date().optional(),
    plannedEndDate: vine.date().optional(),
    actualEndDate: vine.date().optional(),
    teamLeadId: vine
      .number()
      .exists(async (db, value) => {
        return await db.from(User.table).where('id', value).first()
      })
      .optional(),
    awsAccountId: vine.string().trim().optional(),
    memberIds: vine.array(vine.number().positive()).optional(),
  })
)

export type createProjectValidatorInterface = Infer<typeof createProjectValidator>

export const updateProjectValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(150).optional(),
    shortCode: vine.string().trim().optional(),
    description: vine.string().trim().optional(),
    clientId: vine
      .number()
      .exists(async (db, value) => {
        return await db.from(Client.table).where('id', value).first()
      })
      .optional(),
    status: vine.enum(Object.values(projectStatusEnums).map((item) => item.id)).optional(),
    isBillable: vine.boolean().optional(),
    startDate: vine.date().optional(),
    plannedEndDate: vine.date().optional(),
    actualEndDate: vine.date().optional(),
    teamLeadId: vine
      .number()
      .exists(async (db, value) => {
        return await db.from(User.table).where('id', value).first()
      })
      .optional(),
    awsAccountId: vine.string().trim().maxLength(64).optional(),
    memberIds: vine.array(vine.number().positive()).optional(),
  })
)

export type updateProjectValidatorInterface = Infer<typeof updateProjectValidator>

export const projectIdValidator = vine.compile(
  vine.object({
    projectId: vine.number().positive(),
  })
)

export type projectIdValidatorInterface = Infer<typeof projectIdValidator>
