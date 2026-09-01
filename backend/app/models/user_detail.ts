import { DateTime } from 'luxon'
import { BaseModel, beforeFetch, beforeFind, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { softDeleteQuery } from '#helpers/soft_delete_helper'
import File from '#models/file'
import User from '#models/user'

export default class UserDetail extends BaseModel {
  static table = 'user_details'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare employeeId: number | null

  @column()
  declare phoneNumber: string | null

  @column()
  declare emergencyContactNumber: string | null

  @column.date()
  declare dob: DateTime | null

  @column.date()
  declare joiningDate: DateTime | null

  @column()
  declare gender: number | null

  @column()
  declare address: string | null

  @column()
  declare profileFileId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  declare deletedAt: DateTime | null

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => File, { foreignKey: 'profileFileId' })
  declare profileFile: BelongsTo<typeof File>

  @beforeFind()
  @beforeFetch()
  static softDeleteQuery = softDeleteQuery
}
