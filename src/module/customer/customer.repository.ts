import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ICustomer, CustomerEntity } from './customer.model'

export abstract class ICustomerRepository extends Repository<CustomerEntity> {}

@Injectable()
export class CustomerRepository extends ICustomerRepository {
  constructor(private dataSource: DataSource) {
    super(CustomerEntity, dataSource.createEntityManager())
  }
}
