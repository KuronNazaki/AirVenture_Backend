import * as Joi from 'joi'
import { GenderEnum } from 'src/app/constant/app.constant'
import { IAccount } from '../account/account.model'

export const customerRequestSchema = Joi.object({
  name: Joi.string().required(),
})

export const updateCustomerRequestSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  gender: Joi.string().valid(GenderEnum.MALE, GenderEnum.FEMALE).optional(),
  phoneNumber: Joi.string().optional(),
})

export class CustomerRequestDto {
  firstName: string
  lastName: string
  gender: string
  phoneNumber: string
  accountId?: string | IAccount
}
