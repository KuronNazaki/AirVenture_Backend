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
import { AirportRequestDto, airportResponseSchema } from './airport.dto'
import { IAirport } from './airport.model'
import { IAirportService } from './airport.service'

@Controller({ path: 'api/airports', version: '1' })
@UseInterceptors(TransformInterceptor<AirportRequestDto>)
export class AirportController {
  private logger: Logger

  constructor(private readonly airportService: IAirportService) {
    this.logger = new Logger()
  }

  @Get()
  @ResponseMessage('Success')
  findAll(): Promise<IAirport[]> {
    return this.airportService.findAll()
  }

  @Get(':id')
  @ResponseMessage('Success')
  async get(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.airportService.findOne(id)
    return data
  }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Created')
  async create(@Body() role: AirportRequestDto) {
    const createdRole = this.airportService.create(role)
    return createdRole
  }

  @Put(':id')
  @ResponseMessage('Updated')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() role: AirportRequestDto
  ) {
    return this.airportService.update(id, role)
  }

  @Delete(':id')
  @ResponseMessage('Deleted')
  deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.airportService.delete(id)
  }
}
