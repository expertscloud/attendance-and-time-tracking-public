import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import Project from '#models/project'

const projectIdRule = vine
  .number()
  .positive()
  .exists(async (db, value) => {
    return await db.from(Project.table).where('id', value).first()
  })

const projectActionSchema = vine.object({
  notes: vine.string().optional(),
  projectId: projectIdRule,
  workedSeconds: vine.number().positive().optional(),
  isBillable: vine.boolean().optional(),
})

export const projectActionValidator = vine.compile(projectActionSchema)
export type ProjectActionInterface = Infer<typeof projectActionValidator>

export const checkOutValidator = vine.compile(
  vine.object({
    ...projectActionSchema.getProperties(),
    projectId: projectIdRule.optional(),
  })
)
export type CheckOutInterface = Infer<typeof checkOutValidator>

export const pauseTimerValidator = vine.compile(
  vine.object({
    ...projectActionSchema.getProperties(),
    projectId: projectIdRule.optional(),
    idleSeconds: vine.number().positive().optional(),
    workedSeconds: vine.number().positive(),
  })
)
export type PauseTimerInterface = Infer<typeof pauseTimerValidator>

export const getAttendanceStatsValidator = vine.compile(
  vine.object({
    startDate: vine.date().optional(),
    endDate: vine.date().optional(),
    period: vine.enum(['daily', 'weekly', 'monthly']).optional(),
  })
)

export type GetAttendanceStatsValidatorInterface = Infer<typeof getAttendanceStatsValidator>

export const syncWorkedTimeValidator = vine.compile(
  vine.object({
    workedSeconds: vine.number().positive(),
  })
)

export type SyncWorkedTimeValidatorInterface = Infer<typeof syncWorkedTimeValidator>

export const activityStatsValidator = vine.compile(
  vine.object({
    date: vine.date(),
  })
)

export type ActivityStatsValidatorInterface = Infer<typeof activityStatsValidator>

export const recentAttendanceValidator = vine.compile(
  vine.object({
    limit: vine.number().positive().max(50),
  })
)

export type RecentAttendanceValidatorInterface = Infer<typeof recentAttendanceValidator>
