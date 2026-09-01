import { DateTime } from 'luxon'
import User from '#models/user'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { userVerificationTypeEnums } from '#enums/auth_enums'

export default class UserVerification extends BaseModel {
  static table = 'user_verifications'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare verificationCode: string

  @column()
  declare userId: number

  @column({
    serialize: (value: number) => {
      const data = Object.values(userVerificationTypeEnums)
      return data.find((item) => item.id === value)
    },
  })
  declare type: number

  @column({
    serialize: (value: boolean) => {
      return Boolean(value)
    },
  })
  declare isUsed: boolean

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime()
  declare expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
