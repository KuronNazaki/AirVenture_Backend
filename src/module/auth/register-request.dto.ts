import * as Joi from 'joi'

export const registerRequestSchema = Joi.object({
  name: Joi.string().required(),
})

export class RegisterRequestDto {
  firstName: string
  lastName: string
  gender: string
  phoneNumber: string
  email: string
  password: string
}
