import EmailChangedNotification from '#mails/email_changed_notification'
import EmailHistory from '#models/email_history'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import { updateEmailValidator } from '#validators/settings'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import emitter from '@adonisjs/core/services/emitter'
import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'
import { Infer } from '@vinejs/vine/types'

export default class UserService {
  /**
   * Login a user using the provided credentials
   * @param auth - The authenticator instance
   * @param data - The validated login data
   * @returns The logged in user
   */
  async login(auth: Authenticator<Authenticators>, data: Infer<typeof loginValidator>) {
    const user = await User.verifyCredentials(data.email, data.password)

    await auth.use('web').login(user, data.remember)

    return user
  }

  /**
   * Registers a new user with the provided data
   * and logs them in using the web guard.
   * @param auth - The authenticator instance
   * @param data - The validated register data
   * @returns The newly registered user
   */
  async register(auth: Authenticator<Authenticators>, data: Infer<typeof registerValidator>) {
    const user = await User.create(data)

    await auth.use('web').login(user)

    await this.sendWelcomeEmail(user)

    return user
  }

  /**
   * Logout the currently logged in user using the web guard
   * @param auth - The authenticator instance
   */
  async logout(auth: Authenticator<Authenticators>) {
    await auth.use('web').logout()
  }

  /**
   * Updates the email of a user.
   *
   * First, it verifies that the provided password is correct for the authenticated user.
   * Then, it updates the user's email in a transaction.
   * Finally, it sends an email notification that the user's email has been changed.
   *
   * @param user - The user to update the email for.
   * @param data - The validated update email data containing the new email and the current password.
   * @returns A promise resolving when the email has been updated.
   */
  async updateEmail(user: User, data: Infer<typeof updateEmailValidator>) {
    const emailOld = user.email

    // verify the password is correct for auth user
    await User.verifyCredentials(emailOld, data.password)

    await db.transaction(async (trx) => {
      user.useTransaction(trx)

      // update the user's email
      await user.merge({ email: data.email }).save()

      // log the email change history
      await EmailHistory.create(
        {
          userId: user.id,
          emailNew: data.email,
          emailOld,
        },
        { client: trx }
      )
    })

    // queue the email changed notification
    await mail.sendLater(new EmailChangedNotification(emailOld, user))
  }

  /**
   * Deletes a user and any non-cascading relationships.
   * This function is transactional and will roll back if any part of the deletion fails.
   *
   * @param user - The user to delete
   * @returns A promise resolving when the deletion is complete
   */
  async destroy(user: User) {
    await db.transaction(async (trx) => {
      user.useTransaction(trx)

      // if you have any, delete other non-cascading relationships here

      await user.delete()
    })
  }

  /**
   * Sends a welcome email to the user.
   * The email is sent asynchronously and will not block the execution of the current code.
   * @param data - An object containing the user's full name and email address
   * @returns A promise resolving when the email is sent
   */
  async sendWelcomeEmail(data: { fullName: string | null; email: string }) {
    await emitter.emit('mail:send_welcome_email', data)
  }
}
