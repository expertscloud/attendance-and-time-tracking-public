import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const createClientValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    email: vine.string().email().trim().optional(),
    phone: vine.string().trim().optional(),
    website: vine.string().trim().optional(),
    addressLine1: vine.string().trim().optional(),
    addressLine2: vine.string().trim().optional(),
    city: vine.string().trim().optional(),
    state: vine.string().trim().optional(),
    country: vine.string().trim().optional(),
    postalCode: vine.string().trim().optional(),
    fullAddress: vine.string().trim().optional(),
    awsAccountId: vine.string().trim().optional(),
  })
)

export type createClientValidatorInterface = Infer<typeof createClientValidator>

export const updateClientValidator = vine.compile(
  vine.object({
    name: vine.string().trim().optional(),
    email: vine.string().email().trim().optional(),
    phone: vine.string().trim().optional(),
    website: vine.string().trim().optional(),
    addressLine1: vine.string().trim().optional(),
    addressLine2: vine.string().trim().optional(),
    city: vine.string().trim().optional(),
    state: vine.string().trim().optional(),
    country: vine.string().trim().optional(),
    postalCode: vine.string().trim().optional(),
    fullAddress: vine.string().trim().optional(),
    awsAccountId: vine.string().trim().optional(),
  })
)

export type updateClientValidatorInterface = Infer<typeof updateClientValidator>

export const clientIdValidator = vine.compile(
  vine.object({
    clientId: vine.number().positive(),
  })
)

export type clientIdValidatorInterface = Infer<typeof clientIdValidator>
