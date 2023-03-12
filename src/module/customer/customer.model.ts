import { AbstractEntity, IAbstract } from 'src/common/entity/abstract.entity'
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { AccountEntity, IAccount } from '../account/account.model'

export interface ICustomer extends IAbstract {
  firstName: string
  lastName: string
  gender: string
  phoneNumber: string
  email: string
  account: IAccount
}

@Entity({ name: 'customer' })
export class CustomerEntity extends AbstractEntity implements ICustomer {
  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  gender: string

  @Column({ nullable: true })
  phoneNumber: string

  @OneToOne(() => AccountEntity)
  @JoinColumn()
  account: AccountEntity
}
