import * as Joi from 'joi'

export const flightRequestSchema = Joi.object({
  name: Joi.string().required(),
})

export const searchFlightRequestSchema = Joi.object({
  departureCode: Joi.string().required(),
  arrivalCode: Joi.string().required(),
  departDate: Joi.string().isoDate().required(),
})

export class FlightRequestDto {
  aircraftId?: string
  boardingGate?: number
  departTime?: Date
  arriveTime?: Date
  departureId?: string
  arrivalId?: string
}
