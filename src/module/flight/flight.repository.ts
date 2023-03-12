import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { IFlight, FlightEntity } from './flight.model'
import { AirportEntity } from '../airport/airport.model'

export abstract class IFlightRepository extends Repository<FlightEntity> {
  abstract findByDepartureAndArrival(departureId: string, arrivalId: string)
}

@Injectable()
export class FlightRepository extends IFlightRepository {
  async findByDepartureAndArrival(departureId: string, arrivalId: string) {
    const result = await this.dataSource
      .createQueryBuilder(FlightEntity, 'flight')
      // .from(FlightEntity, 'flight')
      .innerJoinAndMapOne(
        'flight.departure',
        'airport',
        'departure',
        'departure.id = flight.departure_id'
      )
      .innerJoinAndMapOne(
        'flight.arrival',
        'airport',
        'arrival',
        'arrival.id = flight.arrival_id'
      )
      .innerJoinAndMapOne(
        'flight.aircraft',
        'aircraft',
        'aircraft',
        'aircraft.id = flight.aircraft_id'
      )
      .addSelect((s) =>
        s
          .select('code')
          .from('aircraft', 'aircraft')
          .where('aircraft.id = flight.aircraft_id')
      )
      .where('departure_id = :departureId', {
        departureId: departureId,
      })
      .andWhere('arrival_id = :arrivalId', {
        arrivalId: arrivalId,
      })
      .getMany()
    console.log(result)
    return result
  }
  constructor(private dataSource: DataSource) {
    super(FlightEntity, dataSource.createEntityManager())
  }
}
