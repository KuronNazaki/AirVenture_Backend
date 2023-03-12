import { Module } from '@nestjs/common'
import { ISeatService, FlightService } from './seat.service'
import { SeatController } from './seat.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ISeatRepository, SeatRepository } from './seat.repository'
import { SeatEntity } from './seat.model'
import { AirportModule } from '../airport/airport.module'
import { AircraftModule } from '../aircraft/aircraft.module'
import { FlightModule } from 'src/module/flight/flight.module'

@Module({
  imports: [TypeOrmModule.forFeature([SeatEntity]), FlightModule],
  providers: [
    {
      provide: ISeatService,
      useClass: FlightService,
    },
    {
      provide: ISeatRepository,
      useClass: SeatRepository,
    },
  ],
  controllers: [SeatController],
  exports: [ISeatService],
})
export class SeatModule {}
