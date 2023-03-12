import { Module } from '@nestjs/common'
import { IInvoiceService, InvoiceService } from './invoice.service'
import { InvoiceController } from './invoice.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IInvoiceRepository, InvoiceRepository } from './invoice.repository'
import { InvoiceEntity } from './invoice.model'
import { AirportModule } from '../airport/airport.module'
import { AircraftModule } from '../aircraft/aircraft.module'
import { AccountService } from '../account/account.service'
import { AccountModule } from '../account/account.module'
import { TicketModule } from '../ticket/ticket.module'
import { forwardRef } from '@nestjs/common/utils'

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceEntity]),
    forwardRef(() => AccountModule),
    forwardRef(() => TicketModule),
  ],
  providers: [
    {
      provide: IInvoiceService,
      useClass: InvoiceService,
    },
    {
      provide: IInvoiceRepository,
      useClass: InvoiceRepository,
    },
  ],
  controllers: [InvoiceController],
  exports: [IInvoiceService],
})
export class InvoiceModule {}
