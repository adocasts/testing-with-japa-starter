import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutController {
  @inject()
  async handle({ response, auth, session }: HttpContext, userService: UserService) {
    await userService.logout(auth)

    session.flash('success', 'See you next time')

    return response.redirect().toRoute('auth.login.show')
  }
}
