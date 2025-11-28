import Post from '#models/post'
import { postValidator } from '#validators/post'
import { Exception } from '@adonisjs/core/exceptions'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import { randomInt } from 'node:crypto'

export default class PostsController {
  async index() {
    return [
      {
        id: 1,
        title: 'My first post',
        summary:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu mi eu magna mattis tempus vel et nisi.',
      },
      {
        id: 2,
        title: 'My second post',
        summary:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu mi eu magna mattis tempus vel et nisi.',
      },
      {
        id: 3,
        title: 'My third post',
        summary:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu mi eu magna mattis tempus vel et nisi.',
      },
    ]
  }

  async show({ params }: HttpContext) {
    if (params.id !== 1) {
      throw new Exception('Post not found', {
        code: 'E_NOT_FOUND',
        status: 404,
      })
    }

    return {
      id: 1,
      title: 'My first post',
      summary:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu mi eu magna mattis tempus vel et nisi. Vestibulum mollis diam sit amet nunc tristique, in condimentum metus fringilla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras sed ex ut eros ultricies consequat.',
    }
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(postValidator)
    const post = {
      id: randomInt(100),
      ...data,
    }

    return response.created(post)
  }

  async uploadThumbnail({ request, response }: HttpContext) {
    const image = request.file('thumbnail', {
      size: '5mb',
      extnames: ['jpeg', 'jpg', 'png'],
    })

    if (!image) {
      return response.badRequest({
        error: 'Image not provided',
      })
    }

    if (image.hasErrors) {
      return response.unprocessableEntity(image.errors)
    }

    const key = `${cuid()}.${image.extname}`
    await image.moveToDisk(key)

    return {
      message: 'Image successfully uploaded',
      filename: key,
      url: image.meta.url,
    }
  }

  async destroy({ response, params, session, bouncer }: HttpContext) {
    const post = await Post.findOrFail(params.id)

    await bouncer.with('PostPolicy').authorize('destroy', post)

    await post.delete()

    session.flash('success', 'Your post was deleted')

    return response.redirect().back()
  }
}
