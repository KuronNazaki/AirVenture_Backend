import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common'
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor'
import { ResponseMessage } from 'src/common/decorator/response-message.decorator'
import { SeatRequestDto } from './seat.dto'
import { ISeat } from './seat.model'
import { ISeatService } from './seat.service'
import { ApiPath } from '../../app/constant/app.constant'

@Controller({ path: [ApiPath.BASE, ApiPath.SEATS].join('/'), version: '1' })
@UseInterceptors(TransformInterceptor<SeatRequestDto>)
export class SeatController {
  constructor(private readonly seatService: ISeatService) {}

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

  // @Post()
  // @HttpCode(201)
  // @ResponseMessage('Role Created')
  // async create(@Body() flightRequest: SeatRequestDto) {
  //   const createdRole = await this.seatService.create(
  //     await this.seatService.generateSeatFromRequest(flightRequest)
  //   )
  //   return createdRole
  // }

  // @Put(':id')
  // @ResponseMessage('Updated')
  // update(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() role: SeatRequestDto
  // ) {
  //   return this.seatService.update(id, role)
  // }

  // @Delete(':id')
  // @ResponseMessage('Deleted')
  // deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.seatService.delete(id)
  // }
}
