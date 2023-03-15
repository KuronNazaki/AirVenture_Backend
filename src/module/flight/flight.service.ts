import { Injectable, Logger } from '@nestjs/common'
import { DeleteResult, UpdateResult } from 'typeorm'
import { IFlightRepository } from './flight.repository'
import { IFlight } from './flight.model'
import { FlightRequestDto } from './flight.dto'
import { IAircraft } from '../aircraft/aircraft.model'
import { IAirport } from '../airport/airport.model'
import { IAircraftService } from '../aircraft/aircraft.service'
import { IAirportService } from '../airport/airport.service'

export abstract class IFlightService {
  abstract findAll(): Promise<IFlight[]>
  abstract findOne(id: string): Promise<IFlight>
  abstract create(role: FlightRequestDto): Promise<IFlight>
  abstract update(is: string, role: FlightRequestDto): Promise<UpdateResult>
  abstract delete(id: string): Promise<DeleteResult>
  abstract generateFlightFromRequest(
    requestDto: FlightRequestDto
  ): Promise<IFlight>
  abstract searchFlights(
    departureId: string,
    arrivalId: string,
    departDate: Date
  ): any
}

@Injectable()
export class FlightService implements IFlightService {
  private logger: Logger

  constructor(
    private readonly flightRepository: IFlightRepository,
    private readonly aircraftService: IAircraftService,
    private readonly airportService: IAirportService
  ) {
    this.logger = new Logger()
  }

  async searchFlights(
    departureCode: string,
    arrivalCode: string,
    departDate: Date
  ) {
    const departure = await this.airportService.findByCode(departureCode)
    const arrival = await this.airportService.findByCode(arrivalCode)
    console.log(departure)
    let listOfFlights = await this.flightRepository.findByDepartureAndArrival(
      departure.id,
      arrival.id
    )
    listOfFlights = listOfFlights.filter((flight) => {
      return (
        flight.departTime.toDateString() === departDate.toDateString() &&
        flight.arriveTime.toDateString() === departDate.toDateString()
      )
    })
    return listOfFlights
  }

  async generateFlightFromRequest(
    requestDto: FlightRequestDto
  ): Promise<IFlight> {
    let aircraft: IAircraft, departure: IAirport, arrival: IAirport
    if (requestDto.aircraftId) {
      aircraft = await this.aircraftService.findOne(requestDto.aircraftId)
    }
    if (requestDto.departureId) {
      departure = await this.airportService.findOne(requestDto.departureId)
    }
    if (requestDto.arrivalId) {
      arrival = await this.airportService.findOne(requestDto.arrivalId)
    }
    const price =
      Number.parseFloat(
        (
          Math.abs(
            new Date(requestDto.arriveTime).getTime() -
              new Date(requestDto.departTime).getTime()
          ) /
          (1000 * 60 * 60)
        ).toFixed(2)
      ) * 1000000
    const flight: IFlight = {
      boardingGate: requestDto.boardingGate,
      departTime: requestDto.departTime,
      arriveTime: requestDto.arriveTime,
      price: price,
      aircraft: aircraft,
      departure: departure,
      arrival: arrival,
    } as IFlight
    console.log(flight)
    return flight
  }

  async findAll(): Promise<IFlight[]> {
    return await this.flightRepository.find({
      relations: {
        aircraft: true,
        departure: true,
        arrival: true,
      },
    })
  }

  async findOne(id: string): Promise<IFlight> {
    const fetchedRole: IFlight = await this.flightRepository.findOne({
      where: { id },
      relations: {
        aircraft: true,
        departure: true,
        arrival: true,
      },
    })
    return fetchedRole
  }

  async create(role: FlightRequestDto): Promise<IFlight> {
    return await this.flightRepository.save(role)
  }

  async update(id: string, role: FlightRequestDto): Promise<UpdateResult> {
    return await this.flightRepository.update(id, role)
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.flightRepository.delete(id)
  }
}
