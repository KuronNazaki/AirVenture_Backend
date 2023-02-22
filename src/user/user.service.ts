import { Injectable, Logger } from '@nestjs/common'
import { DeleteResult, UpdateResult } from 'typeorm'
import { UserEntity } from './user.entity'
import { IUserRepository } from './user.repository'
import { CreateUserDto } from './create-user.dto'

export abstract class IUserService {
  abstract findAll(): Promise<CreateUserDto[]>
  abstract findOne(uuid: string): Promise<CreateUserDto>
  abstract create(user: CreateUserDto): Promise<CreateUserDto>
  abstract update(uuid: string, user: CreateUserDto): Promise<UpdateResult>
  abstract delete(uuid: string): Promise<DeleteResult>
}

@Injectable()
export class UserService implements IUserService {
  private logger: Logger

  constructor(private readonly userRepository: IUserRepository) {
    this.logger = new Logger()
  }

  async findAll(): Promise<CreateUserDto[]> {
    return await this.userRepository.find()
  }

  async findOne(uuid: string): Promise<CreateUserDto> {
    const fetchedUser: CreateUserDto = await this.userRepository.findOneBy({
      uuid,
    })
    return fetchedUser
  }

  async create(user: CreateUserDto): Promise<UserEntity> {
    return await this.userRepository.save(user)
  }

  async update(uuid: string, user: CreateUserDto): Promise<UpdateResult> {
    const id = await this.userRepository.getIdByUuid(uuid)
    return await this.userRepository.update(id, user)
  }

  async delete(uuid: string): Promise<DeleteResult> {
    return await this.userRepository.delete(uuid)
  }
}
