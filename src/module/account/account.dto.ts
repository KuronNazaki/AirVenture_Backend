import * as Joi from 'joi'

export const accountRequestSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  role: Joi.string().optional(),
})

export class AccountRequestDto {
  email: string
  password?: string
  isActive?: boolean
  role?: string
  image?: string
  googleId?: string
}
