const SendWelcomeEmail = () => import('#listeners/send_welcome_email')
import emitter from '@adonisjs/core/services/emitter'

declare module '@adonisjs/core/types' {
  interface EventsList {
    'mail:send_welcome_email': { fullName: string | null; email: string }
  }
}

emitter.on('mail:send_welcome_email', [SendWelcomeEmail, 'handle'])
