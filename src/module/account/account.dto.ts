import * as Joi from 'joi'

export const accountRequestSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  role: Joi.string().optional(),
  image: Joi.string().optional(),
  googleId: Joi.string().optional(),
})

export const retrieveBookingHistoryRequestSchema = Joi.object({
  accountId: Joi.string().uuid().required(),
})

export class AccountRequestDto {
  email?: string
  password?: string
  isActive?: boolean
  role?: string
  image?: string
  googleId?: string
  salt?: string
}
