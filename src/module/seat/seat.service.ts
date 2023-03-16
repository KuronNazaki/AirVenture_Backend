import { Injectable, Logger } from '@nestjs/common'
import { DeleteResult, UpdateResult } from 'typeorm'
import { ISeatRepository } from './seat.repository'
import { ISeat } from './seat.model'
import { SeatRequestDto } from './seat.dto'
import { IAircraft } from '../aircraft/aircraft.model'
import { IAirport } from '../airport/airport.model'
import { IAirportService } from '../airport/airport.service'
import { IFlight } from '../flight/flight.model'
import { IFlightService } from '../flight/flight.service'

export abstract class ISeatService {
  abstract findAll(): Promise<ISeat[]>
  abstract findOne(id: string): Promise<ISeat>
  abstract create(role: SeatRequestDto): Promise<ISeat>
  abstract update(is: string, role: SeatRequestDto): Promise<UpdateResult>
  abstract delete(id: string): Promise<DeleteResult>
  abstract generateSeatFromRequest(requestDto: SeatRequestDto): Promise<ISeat>
  abstract isSeatBooked(code: string, flightId: string)
  abstract getAvailableSeats(flightId: string)
}

@Injectable()
export class FlightService implements ISeatService {
  private logger: Logger

  constructor(
    private readonly seatRepository: ISeatRepository,
    private readonly flightService: IFlightService
  ) {
    this.logger = new Logger()
  }

  async getAvailableSeats(flightId: string) {
    const flight = await this.flightService.findOne(flightId)
    const numberOfSeats = (flight.aircraft as IAircraft).numberOfSeats
    const bookedSeatsList = await this.seatRepository.findSeatsByFlight(
      flightId
    )
    const availableSeatsList = []
    let currentRow = 1
    for (let i = 1; i <= numberOfSeats; i++) {
      let seatCode
      switch (i % 6) {
        case 1:
          seatCode = `${currentRow}A`
          break
        case 2:
          seatCode = `${currentRow}B`
          break
        case 3:
          seatCode = `${currentRow}C`
          break
        case 4:
          seatCode = `${currentRow}D`
          break
        case 5:
          seatCode = `${currentRow}E`
          break
        case 0:
          seatCode = `${currentRow}F`
          currentRow = currentRow + 1
          break
      }
      if (bookedSeatsList.some((seat) => seat.code === seatCode)) {
        continue
      } else {
        availableSeatsList.push(seatCode)
      }
    }
    return availableSeatsList
  }

  async isSeatBooked(code: string, flightId: string) {
    const seat = await this.seatRepository.findSeatByCode(code, flightId)
    return seat != null
  }

  async generateSeatFromRequest(requestDto: SeatRequestDto): Promise<ISeat> {
    let flight: IFlight
    if (requestDto.flightId) {
      flight = await this.flightService.findOne(requestDto.flightId)
    }
    const seat: ISeat = {
      code: requestDto.code,
      flight: flight,
    } as ISeat
    return seat
  }

  async findAll(): Promise<ISeat[]> {
    return await this.seatRepository.find({
      relations: {
        flight: {
          aircraft: true,
          departure: true,
          arrival: true,
        },
      },
    })
  }

  async findOne(id: string): Promise<ISeat> {
    const fetchedRole: ISeat = await this.seatRepository.findOneBy({
      id,
    })
    return fetchedRole
  }

  async create(role: SeatRequestDto): Promise<ISeat> {
    return await this.seatRepository.save(role)
  }

  async update(id: string, role: SeatRequestDto): Promise<UpdateResult> {
    return await this.seatRepository.update(id, role)
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.seatRepository.delete(id)
  }
}
