import PasswordResetToken from '#models/password_reset_token'
import User from '#models/user'
import env from '#start/env'
import { Exception } from '@adonisjs/core/exceptions'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import mail from '@adonisjs/mail/services/main'
import { DateTime, DurationLikeObject } from 'luxon'

export default class PasswordResetService {
  // how long the token will remain valid after creation
  validFor: DurationLikeObject = { hour: 1 }

  /**
   * Creates a password reset token and sends a "forgot password" email
   * @param email user's email
   * @returns
   */
  async send(email: string) {
    // find the user and generate a token value
    const user = await User.findBy('email', email)
    const { value, encryptedValue } = PasswordResetToken.generate()

    // silently fail if email does not exist
    if (!user) return

    // expire all previous tokens and create a new one
    await this.expireAllForUser(user)
    await PasswordResetToken.create({
      expiresAt: DateTime.now().plus(this.validFor),
      userId: user.id,
      value,
    })

    // create the password reset link
    const resetLink = router
      .builder()
      .prefixUrl(env.get('APP_URL'))
      .params({ value: encryptedValue })
      .make('auth.password.reset')

    // send the email
    await mail.sendLater((message) => {
      message
        .subject(`Reset your ${app.appName} password`)
        .to(user.email)
        .htmlView('emails/auth/forgot_password', {
          user,
          resetLink,
          validFor: Object.keys(this.validFor).reduce(
            (acc, key) => `${acc} ${this.validFor[key as keyof DurationLikeObject]} ${key}`.trim(),
            ''
          ),
        })
    })
  }

  /**
   * Validates the password reset token and update's the user's password
   * @param encryptedValue encrypted password reset token value
   * @param password user's new password
   * @returns
   */
  async reset(encryptedValue: string, password: string) {
    // verify the token value and get the associated user
    const { isValid, user } = await PasswordResetToken.verify(encryptedValue)

    // if the token is invalid or not matched to a user, throw invalid exception
    if (!isValid || !user) {
      throw new Exception('The password reset token provided is invalid or expired', {
        status: 403,
        code: 'E_INVALID_PASSWORD_RESET_TOKEN',
      })
    }

    // update the user's password and expire all pending tokens
    await user.merge({ password }).save()
    await this.expireAllForUser(user)

    // make a login link
    const loginLink = router.builder().prefixUrl(env.get('APP_URL')).make('auth.login.show')

    await mail.sendLater((message) => {
      message
        .subject(`Your ${app.appName} password has been reset`)
        .to(user.email)
        .htmlView('emails/auth/password_reset', {
          user,
          loginLink,
        })
    })

    return user
  }

  /**
   * Expires all pending password reset tokens for the provided user
   * @param user user model
   */
  async expireAllForUser(user: User) {
    await PasswordResetToken.query()
      .where('userId', user.id)
      .where('expiresAt', '>=', DateTime.now().toSQL({ includeOffset: false }))
      .update({
        expiresAt: DateTime.now().toSQL({ includeOffset: false }),
        updatedAt: DateTime.now().toSQL({ includeOffset: false }),
      })
  }
}
