import { AbstractEntity, IAbstract } from 'src/common/entity/abstract.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { FlightEntity, IFlight } from '../flight/flight.model'

export interface ISeat extends IAbstract {
  code: string
  flight: IFlight | string
}

@Entity({ name: 'seat' })
export class SeatEntity extends AbstractEntity implements ISeat {
  @Column()
  code: string

  @ManyToOne(() => FlightEntity)
  @JoinColumn()
  flight: FlightEntity
}
