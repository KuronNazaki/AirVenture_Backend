import { Module } from '@nestjs/common'
import { ICustomerService, CustomerService } from './customer.service'
import { CustomerController } from './customer.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ICustomerRepository, CustomerRepository } from './customer.repository'
import { CustomerEntity } from './customer.model'
import { AccountModule } from '../account/account.module'
import { forwardRef } from '@nestjs/common/utils'

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity]),
    forwardRef(() => AccountModule),
  ],
  providers: [
    {
      provide: ICustomerService,
      useClass: CustomerService,
    },
    {
      provide: ICustomerRepository,
      useClass: CustomerRepository,
    },
  ],
  controllers: [CustomerController],
  exports: [ICustomerService],
})
export class CustomerModule {}
