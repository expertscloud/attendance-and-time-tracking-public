import { DateTime } from 'luxon'
import { BaseModel, beforeFetch, beforeFind, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Attendance from '#models/attendance'
import Project from '#models/project'
import { softDeleteQuery } from '#helpers/soft_delete_helper'

export default class TimeEntry extends BaseModel {
  static table = 'time_entries'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare attendanceId: number

  @column()
  declare type: 'work' | 'pause' | 'away'

  @column.dateTime()
  declare startTime: DateTime

  @column.dateTime()
  declare endTime: DateTime | null

  @column()
  declare notes: string | null

  @column()
  declare projectId: number

  @column()
  declare isBillable: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  declare deletedAt: DateTime | null

  @belongsTo(() => Attendance)
  declare attendance: BelongsTo<typeof Attendance, typeof TimeEntry>

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project, typeof TimeEntry>

  @beforeFind()
  @beforeFetch()
  static softDeleteQuery = softDeleteQuery
}
