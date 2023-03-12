import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { IAircraft, AircraftEntity } from './aircraft.model'

export abstract class IAircraftRepository extends Repository<AircraftEntity> {}

@Injectable()
export class AircraftRepository extends IAircraftRepository {
  constructor(private dataSource: DataSource) {
    super(AircraftEntity, dataSource.createEntityManager())
  }
}
