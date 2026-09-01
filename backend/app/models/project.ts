import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Client from './client.js'
import User from './user.js'
import ProjectMember from './project_member.js'
import { projectStatusEnums } from '#enums/master_enum'

export const projectFilterEnum = [
  'id',
  'name',
  'short_code',
  'client_id',
  'status',
  'is_billable',
  'start_date',
  'planned_end_date',
  'actual_end_date',
  'team_lead_id',
  'aws_account_id',
]

export const projectSortEnum = [
  'id',
  'name',
  'short_code',
  'client_id',
  'status',
  'is_billable',
  'start_date',
  'planned_end_date',
  'actual_end_date',
  'team_lead_id',
  'aws_account_id',
  'created_at',
]

export default class Project extends BaseModel {
  static table = 'projects'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare shortCode: string

  @column()
  declare description: string | null

  @column()
  declare clientId: number

  @column({
    serialize: (value: number) => {
      const data = Object.values(projectStatusEnums)
      return data.find((item) => item.id === value)
    },
  })
  declare status: number

  @column()
  declare isBillable: boolean

  @column.date()
  declare startDate: DateTime

  @column.date()
  declare plannedEndDate: DateTime | null

  @column.date()
  declare actualEndDate: DateTime | null

  @column()
  declare teamLeadId: number | null

  @column()
  declare awsAccountId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  declare deletedAt: DateTime | null

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => User, {
    foreignKey: 'teamLeadId',
  })
  declare teamLead: BelongsTo<typeof User>

  @hasMany(() => ProjectMember)
  declare projectMembers: HasMany<typeof ProjectMember>

  @manyToMany(() => User, {
    pivotTable: 'project_members',
  })
  declare members: ManyToMany<typeof User>
}
