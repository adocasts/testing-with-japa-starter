import EmailChangedNotification from '#mails/email_changed_notification'
import EmailHistory from '#models/email_history'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import { updateEmailValidator } from '#validators/settings'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import app from '@adonisjs/core/services/app'
import emitter from '@adonisjs/core/services/emitter'
import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'
import { Infer } from '@vinejs/vine/types'

export default class UserService {
  async login(auth: Authenticator<Authenticators>, data: Infer<typeof loginValidator>) {
    const user = await User.verifyCredentials(data.email, data.password)

    await auth.use('web').login(user, data.remember)

    return user
  }

  async register(auth: Authenticator<Authenticators>, data: Infer<typeof registerValidator>) {
    const user = await User.create(data)

    await auth.use('web').login(user)

    await this.sendWelcomeEmail(user)

    return user
  }

  async logout(auth: Authenticator<Authenticators>) {
    await auth.use('web').logout()
  }

  async updateEmail(user: User, data: Infer<typeof updateEmailValidator>) {
    const emailOld = user.email

    // verify the password is correct for auth user
    await User.verifyCredentials(emailOld, data.password)

    await db.transaction(async (trx) => {
      user.useTransaction(trx)

      await user.merge({ email: data.email }).save()
      await EmailHistory.create(
        {
          userId: user.id,
          emailNew: data.email,
          emailOld,
        },
        { client: trx }
      )
    })

    await mail.sendLater(new EmailChangedNotification(emailOld, user))
  }

  async destroy(user: User) {
    await db.transaction(async (trx) => {
      user.useTransaction(trx)

      // if you have any, delete other non-cascading relationships here

      await user.delete()
    })
  }

  async sendWelcomeEmail(data: { fullName: string | null; email: string }) {
    await emitter.emit('mail:send_welcome_email', data)
  }
}
