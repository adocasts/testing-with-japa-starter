import PasswordResetService from '#services/password_reset_service'
import { passwordResetSendValidator, passwordResetValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ForgotPasswordsController {
  #sentSessionKey = 'FORGOT_PASSWORD_SENT'

  constructor(protected passwordResetService: PasswordResetService) {}

  async index({ view, session }: HttpContext) {
    const isSent = session.flashMessages.has(this.#sentSessionKey)

    return view.render('pages/auth/forgot_password/index', { isSent })
  }

  async send({ request, response, session }: HttpContext) {
    const { email } = await request.validateUsing(passwordResetSendValidator)

    await this.passwordResetService.send(email)

    session.flash(this.#sentSessionKey, true)

    return response.redirect().back()
  }

  async reset({ params, view }: HttpContext) {
    const { isValid, user } = await this.passwordResetService.verify(params.value)
    return view.render('pages/auth/forgot_password/reset', {
      value: params.value,
      email: user?.email,
      isValid,
    })
  }

  async update({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(passwordResetValidator)

    await this.passwordResetService.reset(data.value, data.password)

    session.flash('success', 'Your password has been updated')

    return response.redirect().toRoute('auth.login.show')
  }
}
