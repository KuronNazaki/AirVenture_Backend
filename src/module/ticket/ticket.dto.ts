import * as Joi from 'joi'

export const ticketRequestSchema = Joi.object({
  name: Joi.string().required(),
})

export class TicketRequestDto {
  reservationCode?: string
  status?: string
  price?: number
  email?: string
  customerId?: string
  flightId?: string
  seatId?: string
  invoiceId?: string
}
