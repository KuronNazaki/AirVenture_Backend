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
  UseFilters,
  HttpCode,
} from '@nestjs/common'
import { JoiValidationPipe } from 'src/common/pipe/joi-validation.pipe'
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor'
import { ResponseMessage } from 'src/common/decorator/response-message.decorator'
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter'
import { CustomerRequestDto, customerRequestSchema } from './customer.dto'
import { ICustomer } from './customer.model'
import { ICustomerService } from './customer.service'

@Controller({ path: 'api/customers', version: '1' })
@UseInterceptors(TransformInterceptor<CustomerRequestDto>)
// @UseFilters(HttpExceptionFilter)
export class CustomerController {
  private logger: Logger

  constructor(private readonly customerService: ICustomerService) {
    this.logger = new Logger()
  }

  @Get()
  @ResponseMessage('Success')
  findAll(): Promise<ICustomer[]> {
    return this.customerService.findAll()
  }

  // @Get(':id')
  // @ResponseMessage('Success')
  // async get(@Param('id', new ParseUUIDPipe()) id: string) {
  //   const data = await this.roleService.findOne(id)
  //   return data
  // }

  // @Post()
  // @HttpCode(201)
  // @ResponseMessage('Role Created')
  // @UsePipes(new JoiValidationPipe(customerRequestSchema))
  // async create(@Body() role: CustomerRequestDto) {
  //   const createdRole = this.roleService.create(role)
  //   return createdRole
  // }

  // @Put(':id')
  // @ResponseMessage('Updated')
  // update(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() role: CustomerRequestDto
  // ) {
  //   return this.roleService.update(id, role)
  // }

  // @Delete(':id')
  // @ResponseMessage('Deleted')
  // deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.roleService.delete(id)
  // }
}
