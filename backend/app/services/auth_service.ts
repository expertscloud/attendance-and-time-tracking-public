import User from '#models/user'
import { registerValidatorInterface } from '#validators/auth_validator'
import { DateTime } from 'luxon'
import { sendSuccess } from './custom_response_service.js'
import { getUserByEmail } from './user_service.js'
import { getAllLeaveTypes } from './leave_type_service.js'
import { frontendBaseUrl, otpConfig } from '#config/services'
import { generateForgotPasswordVerificationCode } from './verification_code_service.js'
import UserForgotPasswordEvent from '#events/user_forgot_password_event'
import ForgotPasswordConfirmationEvent from '#events/forgot_password_confirmation_event'
import db from '@adonisjs/lucid/services/db'

export const registerUser = async (payload: registerValidatorInterface) => {
  return await User.create(payload)
}

export const loginUser = async (email: string, password: string) => {
  const user = await User.verifyCredentials(email, password)

  if (!user.isActive) {
    throw new Error('Your account is not active. Please contact your admin.')
  }

  const token = await User.accessTokens.create(user, ['*'])
  const leaveTypes = await getAllLeaveTypes()
  return { token, user, leaveTypes }
}

export const forgotPassword = async (email: string) => {
  try {
    let userDB = await getUserByEmail(email)

    if (!userDB.status) {
      return userDB
    }

    const user = userDB.data

    const expiresAt = DateTime.now().plus({
      seconds: otpConfig.OTP_EXPIRES_TIME_IN_SEC,
    })

    const newCode = await generateForgotPasswordVerificationCode(user, expiresAt)

    UserForgotPasswordEvent.dispatch({
      user,
      userVerification: newCode,
      frontendBaseUrl: frontendBaseUrl,
    })

    return sendSuccess('Forgot password email sent')
  } catch (error: any) {
    throw new Error('Forgot password email sent failed')
  }
}

export const changePassword = async (user: User, previousPassword: string, newPassword: string) => {
  try {
    await User.verifyCredentials(user.email, previousPassword)
    user.password = newPassword
    await user.save()
    await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()

    const token = await User.accessTokens.create(user, ['*'])
    const leaveTypes = await getAllLeaveTypes()
    return { token, user, leaveTypes }
  } catch (error) {
    throw new Error('The previous password is incorrect')
  }
}

export const forgotPasswordAllowReset = async (email: string, password: string) => {
  try {
    const userDB = await getUserByEmail(email)

    if (!userDB.status) {
      return userDB
    }

    const user = userDB.data
    user.password = password
    await user.save()

    ForgotPasswordConfirmationEvent.dispatch({
      fullName: user.fullName || '',
      email: user.email,
      frontendBaseUrl: frontendBaseUrl,
    })

    return sendSuccess('Password Changed Successfully')
  } catch (error: any) {
    throw new Error(`Error getting user for reset password: ${error.message}`)
  }
}
