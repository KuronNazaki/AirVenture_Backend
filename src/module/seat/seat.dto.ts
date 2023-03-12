import * as Joi from 'joi'

export const seatRequestSchema = Joi.object({
  name: Joi.string().required(),
})

export class SeatRequestDto {
  code?: string
  flightId?: string
}
