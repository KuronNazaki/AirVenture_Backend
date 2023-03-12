import { AbstractEntity, IAbstract } from 'src/common/entity/abstract.entity'
import { Column, Entity } from 'typeorm'

export interface IRole extends IAbstract {
  id: string
  name: string
}

@Entity({ name: 'role' })
export class RoleEntity extends AbstractEntity implements IRole {
  @Column({ unique: true })
  name: string
}
