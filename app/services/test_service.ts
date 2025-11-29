import { Exception } from '@adonisjs/core/exceptions'
import { setTimeout } from 'node:timers/promises'

export default class TestService {
  /**
   * Retrieve a user by its ID.
   * @throws {Exception} If the user is not found
   * @throws {Exception} If the user ID is invalid
   * @returns An object representing the user
   */
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

  /**
   * Check if a given email is valid.
   * @param email - The email address to check
   * @returns True if the email is valid, false otherwise
   */
  isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  /**
   * Retrieves a dataset of example emails to test the email validation.
   * The dataset contains the following:
   * - johndoe@test.com: A valid email address
   * - invalid-email: An invalid email address
   * - jonny.bollami@test.com: A valid email address
   * @returns An array of objects containing email addresses and their validation results
   */
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

  /**
   * Retrieves a dataset of example emails to test the email validation asynchronously.
   * The dataset contains the following:
   * - johndoe@test.com: A valid email address
   * - invalid-email: An invalid email address
   * - jonny.bollami@test.com: A valid email address
   * @returns A promise resolving to an array of objects containing email addresses and their validation results
   */
  async getEmailDatasetAsync() {
    await setTimeout(50)
    return this.getEmailDataset()
  }

  /**
   * Example of a method that pings an external service.
   * It takes a status string as an argument and returns the same status string after 100ms.
   * @param status - The status string to return after the delay.
   * @returns A promise resolving to the same status string after the delay.
   */
  async pingExternalServiceExample(status: string) {
    await setTimeout(100)
    return status
  }
}
