import * as Joi from 'joi'
import { GenderEnum, RolesEnum } from '../../app/constant/app.constant'

export const registerRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string()
    .valid(RolesEnum.AUTHENTICATED_CUSTOMER, RolesEnum.EMPLOYEE)
    .optional(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  gender: Joi.string().valid(GenderEnum.MALE, GenderEnum.FEMALE).required(),
  phoneNumber: Joi.string().required(),
})

export class RegisterRequestDto {
  firstName?: string
  lastName?: string
  gender?: string
  phoneNumber?: string
  email?: string
  password?: string
  role?: string
}
