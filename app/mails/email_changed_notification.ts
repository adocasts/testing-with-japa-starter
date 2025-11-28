import User from '#models/user'
import { BaseMail } from '@adonisjs/mail'

export default class EmailChangedNotification extends BaseMail {
  from = 'test@test.com'
  subject = 'Your email has been successfully changed'

  constructor(
    protected emailOld: string,
    protected user: User
  ) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    this.message.to(this.emailOld).htmlView('emails/account/email_changed', { user: this.user })
  }
}
