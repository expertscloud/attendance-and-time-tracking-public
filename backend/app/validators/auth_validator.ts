import User from '#models/user'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(3).maxLength(64),
    email: vine.string().email().trim().unique({
      table: User.table,
      column: 'email',
    }),
    password: vine.string().minLength(8).maxLength(64),
  })
)

registerValidator.messagesProvider = new SimpleMessagesProvider({
  'email.required': 'Email is required',
  'email.database.unique': 'User with email already exists',
})

export type registerValidatorInterface = Infer<typeof registerValidator>

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(64),
  })
)
export type loginValidatorInterface = Infer<typeof loginValidator>

export const forgotPasswordEmailValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)
export type forgotPasswordEmailValidatorInterface = Infer<typeof forgotPasswordEmailValidator>

export const verifyForgotPasswordOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    otp: vine.number(),
  })
)
export type verifyForgotPasswordOtpValidatorInterface = Infer<
  typeof verifyForgotPasswordOtpValidator
>

export const verifyResetPasswordOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    otp: vine.number(),
    password: vine.string().minLength(8).maxLength(64),
  })
)
export type verifyResetPasswordOtpValidatorInterface = Infer<typeof verifyResetPasswordOtpValidator>

export const changePasswordValidator = vine.compile(
  vine.object({
    previousPassword: vine.string().minLength(8).maxLength(64).trim(),
    newPassword: vine.string().minLength(8).maxLength(64).trim(),
  })
)
export type changePasswordValidatorInterface = Infer<typeof changePasswordValidator>
