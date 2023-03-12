import { Transform } from 'class-transformer'
import { AbstractEntity, IAbstract } from 'src/common/entity/abstract.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { AircraftEntity, IAircraft } from '../aircraft/aircraft.model'
import { IAirport, AirportEntity } from '../airport/airport.model'
import { ICustomer } from '../customer/customer.model'
import { FlightEntity, IFlight } from '../flight/flight.model'
import { ISeat, SeatEntity } from '../seat/seat.model'
import { IInvoice, InvoiceEntity } from '../invoice/invoice.model'
import { CustomerEntity } from '../customer/customer.model'

export interface ITicket extends IAbstract {
  reservationCode: string
  status: string
  price: number
  email: string
  customer: ICustomer
  flight: IFlight
  seat: ISeat
  invoice: IInvoice
}

@Entity({ name: 'ticket' })
export class TicketEntity extends AbstractEntity implements ITicket {
  @Column()
  reservationCode: string

  @Column()
  status: string

  @Column()
  price: number

  @Column({ nullable: true })
  email: string

  @ManyToOne(() => CustomerEntity)
  @JoinColumn()
  customer: CustomerEntity

  @ManyToOne(() => FlightEntity)
  @JoinColumn()
  flight: FlightEntity

  @ManyToOne(() => SeatEntity)
  @JoinColumn()
  @Transform(({ value }) => value.code)
  seat: SeatEntity

  @ManyToOne(() => InvoiceEntity)
  @JoinColumn()
  invoice: InvoiceEntity
}
