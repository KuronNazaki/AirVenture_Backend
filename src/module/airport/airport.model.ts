import { AbstractEntity, IAbstract } from 'src/common/entity/abstract.entity'
import { Column, Entity, Unique } from 'typeorm'

export interface IAirport extends IAbstract {
  code: string
  name: string
  cityName: string
  numberOfGates: number
}

@Entity({ name: 'airport' })
export class AirportEntity extends AbstractEntity implements IAirport {
  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column()
  cityName: string

  @Column()
  numberOfGates: number
}
