import { DateTime } from 'luxon'
import { BaseModel, beforeFetch, beforeFind, column } from '@adonisjs/lucid/orm'
import { softDeleteQuery } from '#helpers/soft_delete_helper'

export default class File extends BaseModel {
  static table = 'files'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fileName: string | null

  @column()
  declare fileOriginalName: string | null

  @column()
  declare fileType: string | null

  @column()
  declare fileExt: string | null

  @column()
  declare fileSize: number

  @column()
  declare filePath: string | null

  @column()
  declare associatedTable: string | null

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  declare deletedAt: DateTime | null

  @beforeFind()
  @beforeFetch()
  static softDeleteQuery = softDeleteQuery
}
