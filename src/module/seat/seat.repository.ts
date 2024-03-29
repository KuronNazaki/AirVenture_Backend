import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { SeatEntity } from './seat.model'

export abstract class ISeatRepository extends Repository<SeatEntity> {
  abstract findSeatByCode(code: string, flightId: string)
  abstract findSeatsByFlight(flightId: string)
}

@Injectable()
export class SeatRepository extends ISeatRepository {
  async findSeatsByFlight(flightId: string) {
    return await this.dataSource
      .createQueryBuilder(SeatEntity, 'seat')
      .where('seat.flight_id = :flightId', { flightId })
      .getMany()
  }
  async findSeatByCode(code: string, flightId: string) {
    return await this.dataSource
      .createQueryBuilder(SeatEntity, 'seat')
      .where('seat.code = :code AND seat.flight_id = :flightId', {
        code,
        flightId,
      })
      .getOne()
  }
  constructor(private dataSource: DataSource) {
    super(SeatEntity, dataSource.createEntityManager())
  }
}
