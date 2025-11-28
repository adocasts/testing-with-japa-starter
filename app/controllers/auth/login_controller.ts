import UserService from '#services/user_service'
import { loginValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  @inject()
  async store({ request, response, auth, session }: HttpContext, userService: UserService) {
    const data = await request.validateUsing(loginValidator)
    const user = await userService.login(auth, data)
    const baseMessage = 'Welcome back'

    session.flash('success', user.fullName ? `${baseMessage}, ${user.fullName}` : baseMessage)

    return response.redirect().toRoute('jumpstart')
  }
}
