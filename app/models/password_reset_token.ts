import stringHelpers from '@adonisjs/core/helpers/string'
import encryption from '@adonisjs/core/services/encryption'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from './user.js'

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

  /**
   * Generates a new password reset token value and encrypts it.
   * @returns {{ value: string, encryptedValue: string }}
   */
  static generate() {
    const value = stringHelpers.generateRandom(32)
    const encryptedValue = encryption.encrypt(value)

    return {
      value,
      encryptedValue,
    }
  }

  /**
   * Verifies a password reset token value and returns the associated user.
   * @param encryptedValue - The encrypted password reset token value.
   * @returns An object containiner the validity of the token, the token model instance, and the associated user model instance.
   * @property isValid - Whether the token is valid or not.
   * @property token - The associated password reset token model instance.
   * @property user - The associated user model instance.
   */
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
