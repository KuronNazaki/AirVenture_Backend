import * as Joi from 'joi'

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  userName: Joi.string().required(),
  password: Joi.string().required(),
})

export class CreateUserDto {
  name: string
  // userName: string
  password: string
}
