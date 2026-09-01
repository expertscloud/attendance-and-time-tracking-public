import type { HttpContext } from '@adonisjs/core/http'
import {
  registerValidator,
  loginValidator,
  forgotPasswordEmailValidator,
  verifyForgotPasswordOtpValidator,
  verifyResetPasswordOtpValidator,
  changePasswordValidator,
} from '#validators/auth_validator'
import {
  changePassword as changeUserPassword,
  forgotPassword,
  forgotPasswordAllowReset,
  loginUser,
  registerUser,
} from '#services/auth_service'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { getUserById } from '#services/user_service'
import {
  forgotPasswordTokenVerify,
  forgotPasswordTokenVerifyUpdate,
} from '#services/verification_code_service'

export default class AuthController {
  async register(ctx: HttpContext): Promise<void> {
    try {
      const payload = await registerValidator.validate(ctx.request.body())
      const user = await registerUser(payload)
      const loginData = await loginUser(payload.email, payload.password)

      return sendSuccess('User registered successfully', {
        user,
        token: loginData.token,
        leaveTypes: loginData.leaveTypes,
      })
    } catch (error) {
      console.log('Error in register controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async login(ctx: HttpContext): Promise<void> {
    try {
      const { email, password } = await loginValidator.validate(ctx.request.body())
      const result = await loginUser(email, password)

      return sendSuccess('Logged In Successfully', result)
    } catch (error) {
      console.log('Error in login controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async getUserByToken(ctx: HttpContext): Promise<void> {
    try {
      const authUser = ctx.auth.getUserOrFail()
      const user = await getUserById(authUser.id)

      return sendSuccess('User fetched successfully', user)
    } catch (error) {
      console.log('Error in getUserByToken controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async forgotPassword(ctx: HttpContext) {
    try {
      const payload = await forgotPasswordEmailValidator.validate(ctx.request.body())
      const result = await forgotPassword(payload.email)
      return result
    } catch (error: any) {
      console.log('Error in forgotPassword controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async verifyOtpForgotPassword(ctx: HttpContext) {
    try {
      const { email, otp } = await verifyForgotPasswordOtpValidator.validate(ctx.request.body())
      const result = await forgotPasswordTokenVerify(email, otp.toString())
      return sendSuccess('Verification code for forgot password successfully verified', result)
    } catch (error: any) {
      console.log('Error in verifyOtpForgotPassword controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async changePassword(ctx: HttpContext) {
    try {
      const user = ctx.auth.getUserOrFail()
      const { previousPassword, newPassword } = await changePasswordValidator.validate(
        ctx.request.body()
      )
      const result = await changeUserPassword(user, previousPassword, newPassword)

      return sendSuccess('Password changed successfully', result)
    } catch (error: any) {
      console.log('Error in changePassword controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async forgotPasswordAllowReset(ctx: HttpContext) {
    try {
      const { password, otp, email } = await verifyResetPasswordOtpValidator.validate(
        ctx.request.body()
      )

      const passwordOtpVerification = await forgotPasswordTokenVerify(email, otp.toString())

      if (passwordOtpVerification) {
        const resetPassword = await forgotPasswordAllowReset(email, password)

        if (resetPassword.status) {
          await forgotPasswordTokenVerifyUpdate(otp.toString())
        }

        return resetPassword
      }

      return sendSuccess('Password reset allowed successfully.', passwordOtpVerification)
    } catch (error: any) {
      console.log('Error in forgotPasswordAllowReset controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
