import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { UserEntity } from './user.entity'

export abstract class IUserRepository extends Repository<UserEntity> {
  abstract getIdByUuid(uuid: string): Promise<number>
}

@Injectable()
export class UserRepository extends IUserRepository {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager())
  }

  async getIdByUuid(uuid: string): Promise<number> {
    return (await this.query(`SELECT id FROM users WHERE uuid = $1`, [
      uuid,
    ])) as Promise<number>
  }
}
