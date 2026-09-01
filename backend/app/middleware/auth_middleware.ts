import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    /**
     * For token-based APIs we should not redirect on auth failures.
     * Redirects can produce cross-origin/HTTPS mismatches under ngrok.
     */
    await ctx.auth.authenticateUsing(options.guards)
    return next()
  }
}
