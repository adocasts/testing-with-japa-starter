import { Exception } from '@adonisjs/core/exceptions'
import { setTimeout } from 'node:timers/promises'

export default class TestService {
  async getUser(id: number) {
    await setTimeout(100)

    if (id === 1) {
      return { id: 1, name: 'John Doe' }
    }

    throw new Exception('User not found', {
      status: 404,
      code: 'E_USER_NOT_FOUND',
    })
  }

  isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  getEmailDataset() {
    return [
      {
        email: 'johndoe@test.com',
        result: true,
      },
      {
        email: 'invalid-email',
        result: false,
      },
      {
        email: 'jonny.bollami@test.com',
        result: true,
      },
    ]
  }

  async getEmailDatasetAsync() {
    await setTimeout(50)
    return this.getEmailDataset()
  }

  async pingExternalServiceExample(status: string) {
    await setTimeout(100)
    return status
  }
}
