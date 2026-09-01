import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Attendance from '#models/attendance'
import User from '#models/user'

export default class LocationSnapshot extends BaseModel {
  static table = 'location_snapshots'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare attendanceId: number

  @column()
  declare latitude: number

  @column()
  declare longitude: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  declare deletedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Attendance)
  declare attendance: BelongsTo<typeof Attendance>
}
