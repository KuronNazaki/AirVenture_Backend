import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Logger,
  ParseUUIDPipe,
  UsePipes,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common'
import { JoiValidationPipe } from 'src/common/pipe/joi-validation.pipe'
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor'
import { ResponseMessage } from 'src/common/decorator/response-message.decorator'
import { AircraftRequestDto, aircraftRequestSchema } from './aircraft.dto'
import { IAircraft } from './aircraft.model'
import { IAircraftService } from './aircraft.service'

@Controller({ path: 'api/aircrafts', version: '1' })
@UseInterceptors(TransformInterceptor<AircraftRequestDto>)
export class AircraftController {
  private logger: Logger

  constructor(private readonly aircraftService: IAircraftService) {
    this.logger = new Logger()
  }

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

  @Post()
  @HttpCode(201)
  @ResponseMessage('Created')
  async create(@Body() role: AircraftRequestDto) {
    const createdRole = this.aircraftService.create(role)
    return createdRole
  }

  @Put(':id')
  @ResponseMessage('Updated')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() role: AircraftRequestDto
  ) {
    return this.aircraftService.update(id, role)
  }

  @Delete(':id')
  @ResponseMessage('Deleted')
  deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.aircraftService.delete(id)
  }
}
