import vine from '@vinejs/vine'

export const postValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(50),
    summary: vine.string().maxLength(255),
    body: vine.string().optional(),
  })
)
