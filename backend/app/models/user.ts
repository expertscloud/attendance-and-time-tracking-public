import { DateTime } from 'luxon'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeFetch, beforeFind, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import hash from '@adonisjs/core/services/hash'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { softDeleteQuery, softDeleteUser } from '#helpers/soft_delete_helper'
import Attendance from '#models/attendance'
import Project from './project.js'
import ProjectMember from './project_member.js'
import UserDetail from '#models/user_detail'
import { designationEnums, employmentTypeEnums, workModeEnums } from '#enums/master_enum'
import Leave from '#models/leave'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export const userFilterEnum = ['id', 'full_name', 'email', 'is_active']
export const userSortEnum = ['id', 'full_name', 'email', 'is_active']

export default class User extends compose(BaseModel, AuthFinder) {
  static table = 'users'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column()
  declare type: number

  @column({
    serialize: (value: number) => {
      const data = Object.values(employmentTypeEnums)
      return data.find((item) => item.id === value)
    },
  })
  declare employmentType: number

  @column({
    serialize: (value: number) => {
      const data = Object.values(designationEnums)
      return data.find((item) => item.id === value)
    },
  })
  declare designation: number

  @column({
    serialize: (value: number) => {
      const data = Object.values(workModeEnums)
      return data.find((item) => item.id === value)
    },
  })
  declare workMode: number

  @column({
    serialize: (value) => {
      return Boolean(value)
    },
  })
  declare isActive: boolean

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  declare deletedAt: DateTime | null

  @hasMany(() => Attendance)
  declare attendances: HasMany<typeof Attendance>

  @hasMany(() => Leave)
  declare leaves: HasMany<typeof Leave>

  @hasMany(() => Project, {
    foreignKey: 'teamLeadId',
  })
  declare leadProjects: HasMany<typeof Project>

  @hasMany(() => ProjectMember)
  declare projectMembers: HasMany<typeof ProjectMember>

  @hasOne(() => UserDetail, { foreignKey: 'userId', localKey: 'id' })
  declare userDetail: HasOne<typeof UserDetail>

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
  })

  @beforeFind()
  public static softDeletesFind = softDeleteQuery

  @beforeFetch()
  public static softDeletesFetch = softDeleteQuery

  public async softDelete() {
    await softDeleteUser(this)
  }
}
