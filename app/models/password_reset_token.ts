import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from './user.js'
import stringHelpers from '@adonisjs/core/helpers/string'
import encryption from '@adonisjs/core/services/encryption'

export default class PasswordResetToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare value: string

  @column.dateTime()
  declare expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  get isValid() {
    return this.expiresAt > DateTime.now()
  }

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  static generate() {
    const value = stringHelpers.generateRandom(32)
    const encryptedValue = encryption.encrypt(value)

    return {
      value,
      encryptedValue,
    }
  }

  static async verify(encryptedValue: string) {
    const value = encryption.decrypt(encryptedValue)
    const token = await PasswordResetToken.findBy({ value })
    const user = await token?.related('user').query().first()

    return {
      isValid: token?.isValid,
      token,
      user,
    }
  }
}
