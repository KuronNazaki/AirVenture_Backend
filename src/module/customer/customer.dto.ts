import * as Joi from 'joi'
import { IAccount } from '../account/account.model'

export const customerRequestSchema = Joi.object({
  name: Joi.string().required(),
})

export class CustomerRequestDto {
  firstName: string
  lastName: string
  gender: string
  phoneNumber: string
  accountId?: string | IAccount
}
