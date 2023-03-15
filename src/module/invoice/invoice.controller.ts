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
import { InvoiceRequestDto } from './invoice.dto'
import { IInvoice } from './invoice.model'
import { IInvoiceService } from './invoice.service'
import { Roles } from 'src/common/decorator/roles.decorator'
import { RolesEnum, ApiPath } from '../../app/constant/app.constant'
import { UseGuards } from '@nestjs/common/decorators'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from 'src/common/guard/role-based.guard'

@Controller({ path: [ApiPath.BASE, ApiPath.INVOICES].join('/'), version: '1' })
@UseInterceptors(TransformInterceptor<InvoiceRequestDto>)
export class InvoiceController {
  constructor(private readonly invoiceService: IInvoiceService) {}

  @Get()
  @ResponseMessage('Success')
  findAll(): Promise<IInvoice[]> {
    return this.invoiceService.findAll()
  }

  @Get(':id')
  @ResponseMessage('Success')
  async get(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.invoiceService.findOne(id)
    return data
  }

  // @Post()
  // @HttpCode(201)
  // @ResponseMessage('Role Created')
  // async create(@Body() flightRequest: InvoiceRequestDto) {
  // const createdRole = await this.invoiceController.create()
  // return createdRole
  //   return {}
  // }

  @Post(ApiPath.VERIFY_TRANSACTION)
  @HttpCode(200)
  @Roles(RolesEnum.EMPLOYEE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ResponseMessage('Success')
  async verifyTransaction(@Body() requestDto: { invoiceId: string }) {
    await this.invoiceService.verifyTransaction(requestDto.invoiceId)
  }

  // @Put(':id')
  // @ResponseMessage('Updated')
  // update(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() role: InvoiceRequestDto
  // ) {
  //   return this.invoiceService.update(id, role)
  // }

  // @Delete(':id')
  // @ResponseMessage('Deleted')
  // deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.invoiceService.delete(id)
  // }
}
