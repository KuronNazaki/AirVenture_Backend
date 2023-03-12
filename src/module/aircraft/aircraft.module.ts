import { Module } from '@nestjs/common'
import { IAircraftService, AirportService } from './aircraft.service'
import { AircraftController } from './aircraft.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IAircraftRepository, AircraftRepository } from './aircraft.repository'
import { AircraftEntity } from './aircraft.model'

@Module({
  imports: [TypeOrmModule.forFeature([AircraftEntity])],
  providers: [
    {
      provide: IAircraftService,
      useClass: AirportService,
    },
    {
      provide: IAircraftRepository,
      useClass: AircraftRepository,
    },
  ],
  controllers: [AircraftController],
  exports: [IAircraftService],
})
export class AircraftModule {}
