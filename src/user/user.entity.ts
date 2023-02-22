import { AbstractEntity } from 'src/common/entity/abstract.entity'
import { Column, Entity } from 'typeorm'

export interface IUser {
  id: number
  name: string
  username: string
  password: string
}

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  @Column()
  name: string

  @Column()
  userName: string

  @Column()
  password: string
}
