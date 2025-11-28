import User from '#models/user'
import Post from '#models/post'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import Roles from '../enums/roles.js'

export default class PostPolicy extends BasePolicy {
  before(user: User) {
    // allow admin to do everything
    if (user.roleId === Roles.ADMIN) {
      return true
    }
  }

  destroy(user: User, post: Post): AuthorizerResponse {
    // allow post owner to destroy
    return user.id === post.userId
  }
}
