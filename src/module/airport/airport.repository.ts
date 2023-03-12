import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { IAirport, AirportEntity } from './airport.model'

export abstract class IAirportRepository extends Repository<AirportEntity> {}

@Injectable()
export class AirportRepository extends IAirportRepository {
  constructor(private dataSource: DataSource) {
    super(AirportEntity, dataSource.createEntityManager())
  }
}
