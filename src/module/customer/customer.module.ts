import { Module } from '@nestjs/common'
import { ICustomerService, CustomerService } from './customer.service'
import { CustomerController } from './customer.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ICustomerRepository, CustomerRepository } from './customer.repository'
import { CustomerEntity } from './customer.model'

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
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
