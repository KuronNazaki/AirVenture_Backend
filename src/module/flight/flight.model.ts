import { Transform } from 'class-transformer'
import { AbstractEntity, IAbstract } from 'src/common/entity/abstract.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { AircraftEntity, IAircraft } from '../aircraft/aircraft.model'
import { IAirport, AirportEntity } from '../airport/airport.model'

export interface IFlight extends IAbstract {
  aircraft: IAircraft | string
  boardingGate: number
  departTime: Date
  arriveTime: Date
  price: number
  departure: IAirport | string
  arrival: IAirport | string
}

@Entity({ name: 'flight' })
export class FlightEntity extends AbstractEntity implements IFlight {
  @ManyToOne(() => AircraftEntity)
  @JoinColumn()
  aircraft: AircraftEntity

  @Column()
  boardingGate: number

  @Column({ nullable: true })
  departTime: Date

  @Column({ nullable: true })
  arriveTime: Date

  @ManyToOne(() => AirportEntity)
  @JoinColumn()
  departure: AirportEntity

  @ManyToOne(() => AirportEntity)
  @JoinColumn()
  arrival: AirportEntity

  @Column({ nullable: true })
  price: number
}
