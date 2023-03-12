import * as Joi from 'joi'

export const aircraftRequestSchema = Joi.object({
  name: Joi.string().required(),
})

export class AircraftRequestDto {
  name?: string
  code?: string
  numberOfSeats?: number
}
