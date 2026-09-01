import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Project from './project.js'

export const clientFilterEnum = [
  'id',
  'name',
  'email',
  'phone',
  'website',
  'city',
  'state',
  'country',
  'postal_code',
  'aws_account_id',
]

export const clientSortEnum = [
  'id',
  'name',
  'email',
  'phone',
  'website',
  'city',
  'state',
  'country',
  'postal_code',
  'aws_account_id',
  'created_at',
]

export default class Client extends BaseModel {
  static table = 'clients'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string | null

  @column()
  declare phone: string | null

  @column()
  declare website: string | null

  @column({
    columnName: 'address_line1',
  })
  declare addressLine1: string | null

  @column({
    columnName: 'address_line2',
  })
  declare addressLine2: string | null

  @column()
  declare city: string | null

  @column()
  declare state: string | null

  @column()
  declare country: string | null

  @column()
  declare postalCode: string | null

  @column()
  declare fullAddress: string | null

  @column()
  declare awsAccountId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  declare deletedAt: DateTime | null

  @hasMany(() => Project)
  declare projects: HasMany<typeof Project>
}
