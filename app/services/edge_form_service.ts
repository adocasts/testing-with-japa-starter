import router from '@adonisjs/core/services/router'
import { MakeUrlOptions } from '@adonisjs/core/types/http'

export default class EdgeFormService {
  /**
   * Generates a URL for a given route identifier and optional
   * parameters. The options object can be used to customize
   * the URL generation.
   *
   * @example
   * const url = EdgeFormService.post('posts.index', { id: 1 })
   * // url will be /posts/1
   *
   * @param routeIdentifier - The route identifier to generate a URL for
   * @param [params] - Optional parameters to use when generating the URL
   * @param [options] - Optional options to customize the URL generation
   * @returns The generated URL
   */
  static post(
    routeIdentifier: string,
    params?: any[] | Record<string, any> | undefined,
    options?: MakeUrlOptions | undefined
  ) {
    return router.makeUrl(routeIdentifier, params, options)
  }

  /**
   * Generates a URL for a given route identifier and optional
   * parameters. The options object can be used to customize
   * the URL generation.
   *
   * @example
   * const url = EdgeFormService.put('posts.update', { id: 1 })
   * // url will be /posts/1
   *
   * @param routeIdentifier - The route identifier to generate a URL for
   * @param [params] - Optional parameters to use when generating the URL
   * @param [options] - Optional options to customize the URL generation
   * @returns The generated URL
   */
  static put(
    routeIdentifier: string,
    params?: any[] | Record<string, any> | undefined,
    options?: MakeUrlOptions | undefined
  ) {
    return router.makeUrl(routeIdentifier, params, this.spoof('put', options))
  }

  /**
   * Generates a URL for a given route identifier and optional
   * parameters. The options object can be used to customize
   * the URL generation.
   *
   * @example
   * const url = EdgeFormService.patch('posts.update', { id: 1 })
   * // url will be /posts/1?_method=patch
   *
   * @param routeIdentifier - The route identifier to generate a URL for
   * @param [params] - Optional parameters to use when generating the URL
   * @param [options] - Optional options to customize the URL generation
   * @returns The generated URL
   */
  static patch(
    routeIdentifier: string,
    params?: any[] | Record<string, any> | undefined,
    options?: MakeUrlOptions | undefined
  ) {
    return router.makeUrl(routeIdentifier, params, this.spoof('patch', options))
  }

  /**
   * Generates a URL for a given route identifier and optional
   * parameters. The options object can be used to customize
   * the URL generation.
   *
   * @example
   * const url = EdgeFormService.delete('posts.destroy', { id: 1 })
   * // url will be /posts/1?_method=delete
   *
   * @param routeIdentifier - The route identifier to generate a URL for
   * @param [params] - Optional parameters to use when generating the URL
   * @param [options] - Optional options to customize the URL generation
   * @returns The generated URL
   */
  static delete(
    routeIdentifier: string,
    params?: any[] | Record<string, any> | undefined,
    options?: MakeUrlOptions | undefined
  ) {
    return router.makeUrl(routeIdentifier, params, this.spoof('delete', options))
  }

  /**
   * Generates a random id for an input element. The id is in the
   * format of "_<random string>" where <random string> is a 7
   * character long string of alphanumeric characters. This id
   * is suitable for use as an HTML input element's "id"
   * attribute.
   *
   * @returns A random id string.
   */
  static generateInputId() {
    return '_' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * Creates a new set of query string options that include the
   * _method parameter set to the given method. This is used to
   * spoof the HTTP method used for the request.
   *
   * @param method - The HTTP method to spoof (e.g. 'post', 'put', etc.)
   * @param options - The existing query string options to merge with.
   * @returns The new query string options.
   */
  private static spoof(method: 'post' | 'put' | 'patch' | 'delete', options: MakeUrlOptions = {}) {
    return {
      ...options,
      qs: {
        ...(options.qs || {}),
        _method: method,
      },
    }
  }
}
