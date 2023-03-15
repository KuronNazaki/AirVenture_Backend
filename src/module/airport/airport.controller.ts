import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseUUIDPipe,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common'
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor'
import { ResponseMessage } from 'src/common/decorator/response-message.decorator'
import { AirportRequestDto } from './airport.dto'
import { IAirport } from './airport.model'
import { IAirportService } from './airport.service'
import { Roles } from 'src/common/decorator/roles.decorator'
import { RolesEnum, ApiPath } from '../../app/constant/app.constant'
import { UseGuards } from '@nestjs/common/decorators'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../../common/guard/role-based.guard'

@Controller({ path: [ApiPath.BASE, ApiPath.AIRPORTS].join('/'), version: '1' })
@UseInterceptors(TransformInterceptor<AirportRequestDto>)
export class AirportController {
  constructor(private readonly airportService: IAirportService) {}

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
  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(201)
  @ResponseMessage('Created')
  async create(@Body() role: AirportRequestDto) {
    const createdRole = this.airportService.create(role)
    return createdRole
  }

  // @Put(':id')
  // @ResponseMessage('Updated')
  // update(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() role: AirportRequestDto
  // ) {
  //   return this.airportService.update(id, role)
  // }

  // @Delete(':id')
  // @ResponseMessage('Deleted')
  // deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.airportService.delete(id)
  // }
}
