import UserService from '#services/user_service'
import { registerValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class RegisterController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  @inject()
  async store({ request, response, auth, session }: HttpContext, userService: UserService) {
    const data = await request.validateUsing(registerValidator)
    const user = await userService.register(auth, data)
    const baseMessage = `Welcome to ${app.appName}`

    session.flash('success', user.fullName ? `${baseMessage}, ${user.fullName}` : baseMessage)

    return response.redirect().toRoute('jumpstart')
  }
}
