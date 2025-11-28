import { inject } from '@adonisjs/core'
import { Logger } from '@adonisjs/core/logger'

@inject()
export default class NotificationService {
  constructor(protected logger: Logger) {}

  async send(message: string) {
    this.logger.info('Simulating notification %s', message)

    await new Promise((resolve) => setTimeout(resolve, 5))
  }
}
