import { Transform } from 'class-transformer'
import { AbstractEntity, IAbstract } from 'src/common/entity/abstract.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { AccountEntity, IAccount } from '../account/account.model'
import { AircraftEntity, IAircraft } from '../aircraft/aircraft.model'
import { IAirport, AirportEntity } from '../airport/airport.model'

export interface IInvoice extends IAbstract {
  status: string
  total: number
  account: IAccount
}

@Entity({ name: 'invoice' })
export class InvoiceEntity extends AbstractEntity implements IInvoice {
  @Column()
  status: string

  @Column()
  total: number

  @ManyToOne(() => AccountEntity)
  @JoinColumn()
  account: AccountEntity
}
