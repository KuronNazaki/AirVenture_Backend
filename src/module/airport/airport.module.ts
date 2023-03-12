import { Module } from '@nestjs/common'
import { IAirportService, AirportService } from './airport.service'
import { AirportController } from './airport.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IAirportRepository, AirportRepository } from './airport.repository'
import { AirportEntity } from './airport.model'

@Module({
  imports: [TypeOrmModule.forFeature([AirportEntity])],
  providers: [
    {
      provide: IAirportService,
      useClass: AirportService,
    },
    {
      provide: IAirportRepository,
      useClass: AirportRepository,
    },
  ],
  controllers: [AirportController],
  exports: [IAirportService],
})
export class AirportModule {}
