import WelcomeEmailNotification from '#mails/welcome_email_notification'
import mail from '@adonisjs/mail/services/main'

export default class SendWelcomeEmail {
  async handle({ fullName, email }: { fullName: string | null; email: string }) {
    await mail.send(new WelcomeEmailNotification(fullName, email))
  }
}
