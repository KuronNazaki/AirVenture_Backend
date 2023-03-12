import * as Joi from 'joi'

export const invoiceRequestSchema = Joi.object({
  name: Joi.string().required(),
})

export class InvoiceRequestDto {
  status?: string
  total?: number
  accountId?: string
}
