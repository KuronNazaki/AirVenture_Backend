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
import { InvoiceRequestDto, invoiceRequestSchema } from './invoice.dto'
import { IInvoice } from './invoice.model'
import { IInvoiceService } from './invoice.service'

@Controller({ path: 'api/invoices', version: '1' })
@UseInterceptors(TransformInterceptor<InvoiceRequestDto>)
export class InvoiceController {
  private logger: Logger

  constructor(private readonly invoiceService: IInvoiceService) {
    this.logger = new Logger()
  }

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

  @Post()
  @HttpCode(201)
  @ResponseMessage('Role Created')
  async create(@Body() flightRequest: InvoiceRequestDto) {
    // const createdRole = await this.invoiceController.create()
    // return createdRole
    return {}
  }

  @Post('verify-transaction')
  @HttpCode(200)
  @ResponseMessage('Success')
  async verifyTransaction(@Body() requestDto: { invoiceId: string }) {
    await this.invoiceService.verifyTransaction(requestDto.invoiceId)
  }

  @Put(':id')
  @ResponseMessage('Updated')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() role: InvoiceRequestDto
  ) {
    return this.invoiceService.update(id, role)
  }

  @Delete(':id')
  @ResponseMessage('Deleted')
  deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.invoiceService.delete(id)
  }
}
