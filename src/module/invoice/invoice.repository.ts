import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { IInvoice, InvoiceEntity } from './invoice.model'
import { AccountEntity } from '../account/account.model'

export abstract class IInvoiceRepository extends Repository<InvoiceEntity> {
  abstract findInvoiceByAccountId(accountId: string)
}

@Injectable()
export class InvoiceRepository extends IInvoiceRepository {
  async findInvoiceByAccountId(accountId: string) {
    return await this.dataSource
      .createQueryBuilder(InvoiceEntity, 'invoice')
      .innerJoinAndMapOne(
        'invoice.account',
        AccountEntity,
        'account',
        'account.id = invoice.account_id'
      )
      .where('invoice.account_id = :accountId', { accountId })
      .getMany()
  }
  constructor(private dataSource: DataSource) {
    super(InvoiceEntity, dataSource.createEntityManager())
  }
}
