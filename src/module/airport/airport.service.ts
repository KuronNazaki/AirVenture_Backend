import { Injectable, Logger } from '@nestjs/common'
import { DeleteResult, UpdateResult } from 'typeorm'
import { IAirportRepository } from './airport.repository'
import { IAirport } from './airport.model'
import { AirportRequestDto } from './airport.dto'

export abstract class IAirportService {
  abstract findAll(): Promise<IAirport[]>
  abstract findOne(id: string): Promise<IAirport>
  abstract create(role: AirportRequestDto): Promise<IAirport>
  abstract update(is: string, role: AirportRequestDto): Promise<UpdateResult>
  abstract delete(id: string): Promise<DeleteResult>
  abstract findByCode(code: string)
}

@Injectable()
export class AirportService implements IAirportService {
  private logger: Logger

  constructor(private readonly airportRepository: IAirportRepository) {
    this.logger = new Logger()
  }

  async findByCode(code: string) {
    return await this.airportRepository.findOne({ where: { code: code } })
  }

  async findAll(): Promise<IAirport[]> {
    return await this.airportRepository.find()
  }

  async findOne(id: string): Promise<IAirport> {
    const fetchedRole: IAirport = await this.airportRepository.findOneBy({
      id,
    })
    return fetchedRole
  }

  async create(role: AirportRequestDto): Promise<IAirport> {
    return await this.airportRepository.save(role)
  }

  async update(id: string, role: AirportRequestDto): Promise<UpdateResult> {
    return await this.airportRepository.update(id, role)
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.airportRepository.delete(id)
  }
}
