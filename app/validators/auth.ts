import vine from '@vinejs/vine'

export const emailRule = () => vine.string().maxLength(254).email().trim().toLowerCase()

export const loginValidator = vine.compile(
  vine.object({
    email: emailRule(),
    password: vine.string(),
    remember: vine.boolean().optional(),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().maxLength(254).optional(),
    email: emailRule().unique(async (db, value) => {
      const exists = await db
        .from('users')
        .whereRaw('LOWER(email) = ?', [value])
        .select('id')
        .first()
      return !exists
    }),
    password: vine.string().minLength(8),
  })
)

export const passwordResetSendValidator = vine.compile(
  vine.object({
    email: emailRule(),
  })
)

export const passwordResetValidator = vine.compile(
  vine.object({
    value: vine.string(),
    password: vine.string().minLength(8),
  })
)
