import { Injectable, Logger } from '@nestjs/common'
import { DeleteResult, UpdateResult } from 'typeorm'
import { IAircraftRepository } from './aircraft.repository'
import { IAircraft } from './aircraft.model'
import { AircraftRequestDto } from './aircraft.dto'

export abstract class IAircraftService {
  abstract findAll(): Promise<IAircraft[]>
  abstract findOne(id: string): Promise<IAircraft>
  abstract create(role: AircraftRequestDto): Promise<IAircraft>
  abstract update(is: string, role: AircraftRequestDto): Promise<UpdateResult>
  abstract delete(id: string): Promise<DeleteResult>
}

@Injectable()
export class AirportService implements IAircraftService {
  private logger: Logger

  constructor(private readonly aircraftRepository: IAircraftRepository) {
    this.logger = new Logger()
  }

  async findAll(): Promise<IAircraft[]> {
    return await this.aircraftRepository.find()
  }

  async findOne(id: string): Promise<IAircraft> {
    const fetchedRole: IAircraft = await this.aircraftRepository.findOneBy({
      id,
    })
    return fetchedRole
  }

  async create(role: AircraftRequestDto): Promise<IAircraft> {
    return await this.aircraftRepository.save(role)
  }

  async update(id: string, role: AircraftRequestDto): Promise<UpdateResult> {
    return await this.aircraftRepository.update(id, role)
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.aircraftRepository.delete(id)
  }
}
