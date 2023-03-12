import * as Joi from 'joi'

export const flightRequestSchema = Joi.object({
  name: Joi.string().required(),
})

export class FlightRequestDto {
  aircraftId?: string
  boardingGate?: number
  departTime?: Date
  arriveTime?: Date
  departureId?: string
  arrivalId?: string
}
