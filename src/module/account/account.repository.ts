import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { AccountEntity } from './account.model'

export abstract class IAccountRepository extends Repository<AccountEntity> {}

@Injectable()
export class AccountRepository extends IAccountRepository {
  constructor(private dataSource: DataSource) {
    super(AccountEntity, dataSource.createEntityManager())
  }
}
