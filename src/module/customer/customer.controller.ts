import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Logger,
  ParseUUIDPipe,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common'
import { JoiValidationPipe } from 'src/common/pipe/joi-validation.pipe'
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor'
import { ResponseMessage } from 'src/common/decorator/response-message.decorator'
import { CustomerRequestDto, updateCustomerRequestSchema } from './customer.dto'
import { ICustomer } from './customer.model'
import { ICustomerService } from './customer.service'
import { Roles } from 'src/common/decorator/roles.decorator'
import { RolesEnum, ApiPath } from '../../app/constant/app.constant'
import { UseGuards } from '@nestjs/common/decorators'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../../common/guard/role-based.guard'

@Controller({ path: [ApiPath.BASE, ApiPath.CUSTOMERS].join('/'), version: '1' })
@UseInterceptors(TransformInterceptor<CustomerRequestDto>)
export class CustomerController {
  private logger: Logger

  constructor(private readonly customerService: ICustomerService) {
    this.logger = new Logger()
  }

  @Get()
  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ResponseMessage('Success')
  findAll(): Promise<ICustomer[]> {
    return this.customerService.findAll()
  }

  @Get(':id')
  @Roles(
    RolesEnum.AUTHENTICATED_CUSTOMER,
    RolesEnum.EMPLOYEE,
    RolesEnum.ADMINISTRATOR
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ResponseMessage('Success')
  async get(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.customerService.findOne(id)
    return data
  }

  // @Post()
  // @HttpCode(201)
  // @ResponseMessage('Role Created')
  // @UsePipes(new JoiValidationPipe(customerRequestSchema))
  // async create(@Body() role: CustomerRequestDto) {
  //   const createdRole = this.roleService.create(role)
  //   return createdRole
  // }

  @Put(':id')
  @Roles(
    RolesEnum.AUTHENTICATED_CUSTOMER,
    RolesEnum.EMPLOYEE,
    RolesEnum.ADMINISTRATOR
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new JoiValidationPipe(updateCustomerRequestSchema))
  @ResponseMessage('Updated')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body()
    requestDto: {
      firstName: string
      lastName: string
      gender: string
      phoneNumber: string
    }
  ) {
    return this.customerService.update(id, requestDto)
  }

  // @Delete(':id')
  // @ResponseMessage('Deleted')
  // deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.roleService.delete(id)
  // }
}
