import { Module } from '@nestjs/common'
import { IFlightService, FlightService } from './flight.service'
import { FlightController } from './flight.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IFlightRepository, FlightRepository } from './flight.repository'
import { FlightEntity } from './flight.model'
import { AirportModule } from '../airport/airport.module'
import { AircraftModule } from '../aircraft/aircraft.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([FlightEntity]),
    AirportModule,
    AircraftModule,
  ],
  providers: [
    {
      provide: IFlightService,
      useClass: FlightService,
    },
    {
      provide: IFlightRepository,
      useClass: FlightRepository,
    },
  ],
  controllers: [FlightController],
  exports: [IFlightService],
})
export class FlightModule {}
