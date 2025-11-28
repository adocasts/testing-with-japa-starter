import { BaseMail } from '@adonisjs/mail'

export default class WelcomeEmailNotification extends BaseMail {
  from = 'test@test.com'
  subject = 'Welcome to our app'

  constructor(
    protected fullName: string | null,
    protected email: string
  ) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    this.message.to(this.email).htmlView('emails/auth/welcome', { fullName: this.fullName })
  }
}
