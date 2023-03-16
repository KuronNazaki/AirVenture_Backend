import { Module } from '@nestjs/common'
import { IAccountService, AccountService } from './account.service'
import { AccountController } from './account.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IAccountRepository, AccountRepository } from './account.repository'
import { AccountEntity } from './account.model'
import { RoleModule } from 'src/module/role/role.module'
import { InvoiceModule } from '../invoice/invoice.module'
import { TicketModule } from '../ticket/ticket.module'
import { forwardRef } from '@nestjs/common/utils'
import { FlightModule } from '../flight/flight.module'
import { CustomerModule } from '../customer/customer.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity]),
    RoleModule,
    forwardRef(() => InvoiceModule),
    TicketModule,
    FlightModule,
    CustomerModule,
  ],
  providers: [
    {
      provide: IAccountService,
      useClass: AccountService,
    },
    {
      provide: IAccountRepository,
      useClass: AccountRepository,
    },
  ],
  controllers: [AccountController],
  exports: [IAccountService],
})
export class AccountModule {}
