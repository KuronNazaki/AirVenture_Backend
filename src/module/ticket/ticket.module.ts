import { Module } from '@nestjs/common'
import { ITicketService, TicketService } from './ticket.service'
import { TicketController } from './ticket.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ITicketRepository, TicketRepository } from './ticket.repository'
import { TicketEntity } from './ticket.model'
import { AirportModule } from '../airport/airport.module'
import { AircraftModule } from '../aircraft/aircraft.module'
import { AccountModule } from '../account/account.module'
import { SeatModule } from '../seat/seat.module'
import { CustomerModule } from '../customer/customer.module'
import { InvoiceModule } from '../invoice/invoice.module'
import { FlightModule } from '../flight/flight.module'
import { forwardRef } from '@nestjs/common/utils'

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketEntity]),
    AirportModule,
    AircraftModule,
    forwardRef(() => AccountModule),
    SeatModule,
    CustomerModule,
    forwardRef(() => InvoiceModule),
    FlightModule,
  ],
  providers: [
    {
      provide: ITicketService,
      useClass: TicketService,
    },
    {
      provide: ITicketRepository,
      useClass: TicketRepository,
    },
  ],
  controllers: [TicketController],
  exports: [ITicketService],
})
export class TicketModule {}
