import { Exclude, Transform } from 'class-transformer'
import { AbstractEntity, IAbstract } from 'src/common/entity/abstract.entity'
import { IRole, RoleEntity } from 'src/module/role/role.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'

export interface IAccount extends IAbstract {
  email: string
  password: string
  salt: string
  isActive: boolean
  role: IRole
  image: string
  googleId: string
}

@Entity({ name: 'account' })
export class AccountEntity extends AbstractEntity implements IAccount {
  @Column()
  email: string

  @Column({ nullable: true })
  @Exclude()
  password: string

  @Column({ nullable: true })
  @Exclude()
  salt: string

  @Column()
  isActive: boolean

  // @OneToOne(() => RoleEntity)
  @ManyToOne(() => RoleEntity)
  @JoinColumn()
  @Transform(({ value }) => value.name)
  role: RoleEntity

  @Column({ nullable: true })
  image: string

  @Column({ nullable: true })
  googleId: string
}
