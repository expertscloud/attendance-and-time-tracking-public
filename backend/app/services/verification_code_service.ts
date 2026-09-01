import User from '#models/user'
import UserVerification from '#models/user_verification'
import { DateTime } from 'luxon'
import { userVerificationTypeEnums } from '#enums/auth_enums'
import { getUserByEmail } from '#services/user_service'

export const randomCodeForVerificationNumber = () => {
  return Math.floor(1000 + Math.random() * 9000)
}

export const randomCodeForVerificationString = (length: number = 36) => {
  return Array(length)
    .fill('')
    .map(() => Math.random().toString(36)[2])
    .join('')
}

/**
 * Generates an email verification code for the given user with an expiration date.
 */
export const generateEmailVerificationCode = async (user: User, expiresAt: DateTime, trx?: any) => {
  try {
    const generateCode = randomCodeForVerificationString()
    const data = await UserVerification.create(
      {
        verificationCode: generateCode,
        userId: user.id,
        expiresAt: expiresAt,
        type: userVerificationTypeEnums.email.id,
      },
      { client: trx }
    )
    return data
  } catch (error: any) {
    throw new Error(`Error generating verification code: ${error.message}`)
  }
}

/**
 * Retrieves a UserVerification record by the verification token.
 */
export const getVerificationCodeByToken = async (token: string) => {
  try {
    const verificationCode = await UserVerification.query()
      .where('verification_code', token)
      .first()
    if (!verificationCode) {
      throw new Error(`Verification code with token: ${token} does not exist`)
    }
    return verificationCode
  } catch (error: any) {
    throw new Error(`Error getting verification code: ${error.message}`)
  }
}

/**
 * Retrieves the latest UserVerification record for a given token and user ID.
 */
export const getVerificationCode = async (token: string, id: number) => {
  try {
    const verificationCode = await UserVerification.query()
      .where('verification_code', token)
      .andWhere('user_id', id)
      .orderBy('id', 'desc')
      .preload('user')
      .first()

    if (!verificationCode) {
      throw new Error(`Invalid verification code`)
    }
    return verificationCode
  } catch (error: any) {
    throw new Error(`Error getting verification code: ${error.message}`)
  }
}

/**
 * Generates a numeric verification code for forgot password functionality.
 */
export const generateForgotPasswordVerificationCode = async (user: User, expiresAt: DateTime) => {
  try {
    const generateCode = randomCodeForVerificationNumber()
    const data = await UserVerification.create({
      verificationCode: generateCode.toString(),
      userId: user.id,
      expiresAt: expiresAt,
      type: userVerificationTypeEnums.forgotPassword.id,
    })
    return data
  } catch (error: any) {
    throw new Error(`Error generating verification code for forgot password: ${error.message}`)
  }
}

/**
 * Verifies a forgot password token for a user's email.
 */
export const forgotPasswordTokenVerify = async (email: string, token: string) => {
  try {
    const userDetails = await getUserByEmail(email)
    if (!userDetails.status) {
      return userDetails
    }

    const verificationCode = await getVerificationCode(token, userDetails.data.id)
    if (!verificationCode) {
      return verificationCode
    }

    const now = DateTime.now()

    if (now > verificationCode?.expiresAt) {
      throw new Error('Verification code has expired')
    }

    if (verificationCode.isUsed) {
      throw new Error('Verification code has already been used')
    }

    return token
  } catch (error: any) {
    throw new Error(`Error generating verification code for forgot password: ${error.message}`)
  }
}

/**
 * Marks a forgot password token as used.
 */
export const forgotPasswordTokenVerifyUpdate = async (token: string) => {
  try {
    const tokenDB = await getVerificationCodeByToken(token)

    tokenDB?.merge({
      isUsed: true,
    })

    await tokenDB.save()

    return token
  } catch (error: any) {
    throw new Error(`Error updating the verification code for forgot password: ${error.message}`)
  }
}
