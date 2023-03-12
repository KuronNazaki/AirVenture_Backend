import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export interface IAbstract {
  id: string
  createdAt: Date
  modifiedAt: Date
}

export abstract class AbstractEntity implements IAbstract {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  @Exclude()
  createdAt: Date

  @UpdateDateColumn()
  @Exclude()
  modifiedAt: Date
}
