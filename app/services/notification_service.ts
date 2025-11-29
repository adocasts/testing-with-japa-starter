import { inject } from '@adonisjs/core'
import { Logger } from '@adonisjs/core/logger'

@inject()
export default class NotificationService {
  constructor(protected logger: Logger) {}

  /**
   * Simulates sending a notification with the given message.
   * This is a placeholder for an actual notification service.
   * It will log the message and then wait for 5 milliseconds before resolving.
   *
   * @param message - The message to be sent in the notification.
   */
  async send(message: string) {
    this.logger.info('Simulating notification %s', message)

    await new Promise((resolve) => setTimeout(resolve, 5))
  }
}
