import * as Joi from 'joi'
import { GenderEnum } from 'src/app/constant/app.constant'

export const ticketRequestSchema = Joi.object({
  accountId: Joi.string().uuid().optional(),
  customer: {
    id: Joi.string().uuid().optional(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    gender: Joi.string().valid(GenderEnum.MALE, GenderEnum.FEMALE).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
  },
  flightId: Joi.string().uuid().required(),
  seatCode: Joi.string().required(),
  price: Joi.number().required(),
})

export const retrieveTicketRequestSchema = Joi.object({
  reservationCode: Joi.string().length(6).required(),
})

export const cancelTicketRequestSchema = Joi.object({
  reservationCode: Joi.string().length(6).required(),
})

export const sendEmailRequestSchema = Joi.object({
  reservationCode: Joi.string().length(6).required(),
  email: Joi.string().email().required(),
})

export interface BookTicketRequestDto {
  accountId?: string
  customer: {
    customerId?: string
    firstName?: string
    lastName?: string
    gender?: string
    email?: string
    phoneNumber?: string
  }
  flightId?: string
  seatCode?: string
  price?: number
}

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
