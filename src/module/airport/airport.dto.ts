import * as Joi from 'joi'

export const airportResponseSchema = Joi.object({
  name: Joi.string().required(),
})

export class AirportRequestDto {
  name?: string
  code?: string
  cityName?: string
  numberOfGates?: number
}
