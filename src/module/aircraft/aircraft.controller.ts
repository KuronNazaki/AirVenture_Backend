import {
  Controller,
  Get,
  Param,
  Logger,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common'
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor'
import { ResponseMessage } from 'src/common/decorator/response-message.decorator'
import { AircraftRequestDto } from './aircraft.dto'
import { IAircraft } from './aircraft.model'
import { IAircraftService } from './aircraft.service'
import { ApiPath } from '../../app/constant/app.constant'

@Controller({ path: [ApiPath.BASE, ApiPath.AIRCRAFTS].join('/'), version: '1' })
@UseInterceptors(TransformInterceptor<AircraftRequestDto>)
export class AircraftController {
  constructor(private readonly aircraftService: IAircraftService) {}

  @Get()
  @ResponseMessage('Success')
  findAll(): Promise<IAircraft[]> {
    return this.aircraftService.findAll()
  }

  @Get(':id')
  @ResponseMessage('Success')
  async get(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.aircraftService.findOne(id)
    return data
  }

  // @Post()
  // @HttpCode(201)
  // @ResponseMessage('Created')
  // async create(@Body() role: AircraftRequestDto) {
  //   const createdRole = this.aircraftService.create(role)
  //   return createdRole
  // }

  // @Put(':id')
  // @ResponseMessage('Updated')
  // update(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() role: AircraftRequestDto
  // ) {
  //   return this.aircraftService.update(id, role)
  // }

  // @Delete(':id')
  // @ResponseMessage('Deleted')
  // deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.aircraftService.delete(id)
  // }
}
