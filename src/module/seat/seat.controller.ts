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
import { SeatRequestDto, seatRequestSchema } from './seat.dto'
import { ISeat } from './seat.model'
import { ISeatService } from './seat.service'

@Controller({ path: 'api/seats', version: '1' })
@UseInterceptors(TransformInterceptor<SeatRequestDto>)
export class SeatController {
  private logger: Logger

  constructor(private readonly seatService: ISeatService) {
    this.logger = new Logger()
  }

  @Get()
  @ResponseMessage('Success')
  findAll(): Promise<ISeat[]> {
    return this.seatService.findAll()
  }

  @Get(':id')
  @ResponseMessage('Success')
  async get(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.seatService.findOne(id)
    return data
  }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Role Created')
  async create(@Body() flightRequest: SeatRequestDto) {
    const createdRole = await this.seatService.create(
      await this.seatService.generateSeatFromRequest(flightRequest)
    )
    return createdRole
  }

  @Put(':id')
  @ResponseMessage('Updated')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() role: SeatRequestDto
  ) {
    return this.seatService.update(id, role)
  }

  @Delete(':id')
  @ResponseMessage('Deleted')
  deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.seatService.delete(id)
  }
}
