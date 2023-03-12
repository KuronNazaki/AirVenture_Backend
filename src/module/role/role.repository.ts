import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { IRole, RoleEntity } from './role.entity'

export abstract class IRoleRepository extends Repository<RoleEntity> {
  abstract getRoleByName(name: string)
}

@Injectable()
export class RoleRepository extends IRoleRepository {
  constructor(private dataSource: DataSource) {
    super(RoleEntity, dataSource.createEntityManager())
  }

  async getRoleByName(name: string) {
    return (await this.query(`SELECT * FROM role WHERE name = $1`, [
      name,
    ])) as Promise<IRole>
  }
}
