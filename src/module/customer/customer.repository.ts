import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ICustomer, CustomerEntity } from './customer.model'
import { AccountEntity } from '../account/account.model'

export abstract class ICustomerRepository extends Repository<CustomerEntity> {
  abstract findOneByAccountId(accountId: string)
}

@Injectable()
export class CustomerRepository extends ICustomerRepository {
  async findOneByAccountId(accountId: string) {
    return await this.dataSource
      .createQueryBuilder(CustomerEntity, 'customer')
      .where('customer.account_id = :accountId', { accountId })
      .getOne()
  }
  constructor(private dataSource: DataSource) {
    super(CustomerEntity, dataSource.createEntityManager())
  }
}
