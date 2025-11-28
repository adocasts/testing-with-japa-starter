import UserService from '#services/user_service'
import { emailRule } from '#validators/auth'
import { updateEmailValidator } from '#validators/settings'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class AccountController {
  constructor(protected userService: UserService) {}

  async index({ view }: HttpContext) {
    return view.render('pages/settings/account')
  }

  async updateEmail({ request, response, auth, session }: HttpContext) {
    const data = await request.validateUsing(updateEmailValidator)
    const user = auth.use('web').user!

    if (data.email === user.email) {
      session.flash('success', 'You are already using the submitted email')
      return response.redirect().back()
    }

    await this.userService.updateEmail(user, data)

    session.flash('success', 'Your email has been updated')

    return response.redirect().back()
  }

  async destroy({ request, response, auth, session }: HttpContext) {
    const user = auth.use('web').user!
    const validator = vine.compile(
      vine.object({
        confirmEmail: emailRule().in([user.email]),
      })
    )

    await validator.validate(request.all())
    await this.userService.destroy(user)
    await auth.use('web').logout()

    session.flash('success', 'Your account has been deleted')

    return response.redirect().toRoute('auth.register.show')
  }
}
