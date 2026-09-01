import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import TimeEntry from '#models/time_entry'
import { attendanceStatus } from '#enums/attendance_enum'

export default class Attendance extends BaseModel {
  static table = 'attendances'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column.dateTime()
  declare checkInTime: DateTime

  @column.dateTime()
  declare checkOutTime: DateTime | null

  @column()
  declare totalWorkingSeconds: number

  @column({
    consume: (val) => val,
    serialize: (val: string) => {
      if (!val) return null
      return Object.values(attendanceStatus).find((status) => status === val)
    },
  })
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  declare deletedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => TimeEntry)
  declare timeEntries: HasMany<typeof TimeEntry>
}
