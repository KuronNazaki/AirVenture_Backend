import { Injectable, Logger } from '@nestjs/common'
import { DeleteResult, UpdateResult } from 'typeorm'
import { IRoleRepository } from './role.repository'
import { IRole } from './role.entity'
import { RoleRequestDto } from './role.dto'

export abstract class IRoleService {
  abstract findAll(): Promise<IRole[]>
  abstract findOne(id: string): Promise<IRole>
  abstract findOneByName(name: string): Promise<IRole>
  abstract create(role: RoleRequestDto): Promise<IRole>
  abstract update(is: string, role: RoleRequestDto): Promise<UpdateResult>
  abstract delete(id: string): Promise<DeleteResult>
}

@Injectable()
export class RoleService implements IRoleService {
  private logger: Logger

  constructor(private readonly roleRepository: IRoleRepository) {
    this.logger = new Logger()
  }

  async findAll(): Promise<IRole[]> {
    return await this.roleRepository.find()
  }

  async findOne(id: string): Promise<IRole> {
    const fetchedRole: IRole = await this.roleRepository.findOneBy({
      id,
    })
    return fetchedRole
  }

  async findOneByName(name: string): Promise<IRole> {
    const fetchedRole: IRole = await this.roleRepository.getRoleByName(name)
    return fetchedRole[0]
  }

  async create(role: RoleRequestDto): Promise<IRole> {
    return await this.roleRepository.save(role)
  }

  async update(id: string, role: RoleRequestDto): Promise<UpdateResult> {
    return await this.roleRepository.update(id, role)
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.roleRepository.delete(id)
  }
}
