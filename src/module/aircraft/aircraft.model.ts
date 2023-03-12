import { AbstractEntity, IAbstract } from 'src/common/entity/abstract.entity'
import { Column, Entity, Unique } from 'typeorm'

export interface IAircraft extends IAbstract {
  code: string
  name: string
  numberOfSeats: number
}

@Entity({ name: 'aircraft' })
export class AircraftEntity extends AbstractEntity implements IAircraft {
  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column()
  numberOfSeats: number
}
