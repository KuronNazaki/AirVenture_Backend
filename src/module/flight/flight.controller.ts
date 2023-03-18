import {
  Body,
  Controller,
  Get,
  Param,
  Logger,
  ParseUUIDPipe,
  UsePipes,
  UseInterceptors,
  Post,
  HttpCode,
} from '@nestjs/common'
import { JoiValidationPipe } from 'src/common/pipe/joi-validation.pipe'
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor'
import { ResponseMessage } from 'src/common/decorator/response-message.decorator'
import { FlightRequestDto, searchFlightRequestSchema } from './flight.dto'
import { IFlight } from './flight.model'
import { IFlightService } from './flight.service'
import { ApiPath } from '../../app/constant/app.constant'

@Controller({ path: [ApiPath.BASE, ApiPath.FLIGHTS].join('/'), version: '1' })
@UseInterceptors(TransformInterceptor<FlightRequestDto>)
export class FlightController {
  private logger: Logger

  constructor(private readonly flightService: IFlightService) {
    this.logger = new Logger()
  }

  @Get()
  @ResponseMessage('Success')
  findAll(): Promise<IFlight[]> {
    return this.flightService.findAll()
  }

  @Post(ApiPath.SEARCH)
  @UsePipes(new JoiValidationPipe(searchFlightRequestSchema))
  @ResponseMessage('Success')
  async searchFlights(
    @Body()
    requestDto: {
      departureCode: string
      arrivalCode: string
      departDate: string
    }
  ) {
    return await this.flightService.searchFlights(
      requestDto.departureCode,
      requestDto.arrivalCode,
      new Date(requestDto.departDate)
    )
  }

  @Get(':id')
  @ResponseMessage('Success')
  async get(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.flightService.findOne(id)
    return data
  }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Flight Created')
  async create(@Body() flightRequest: FlightRequestDto) {
    const createdRole = await this.flightService.create(
      await this.flightService.generateFlightFromRequest(flightRequest)
    )
    return createdRole
  }

  // @Put(':id')
  // @ResponseMessage('Updated')
  // update(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() role: FlightRequestDto
  // ) {
  //   return this.flightService.update(id, role)
  // }

  // @Delete(':id')
  // @ResponseMessage('Deleted')
  // deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.flightService.delete(id)
  // }
}
