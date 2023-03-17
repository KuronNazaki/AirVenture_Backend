import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  UsePipes,
  UseInterceptors,
  UseGuards,
  HttpCode,
  Req,
} from '@nestjs/common'
import { JoiValidationPipe } from 'src/common/pipe/joi-validation.pipe'
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor'
import { ResponseMessage } from 'src/common/decorator/response-message.decorator'
import {
  AccountRequestDto,
  retrieveBookingHistoryRequestSchema,
} from './account.dto'
import { IAccountService } from './account.service'
import { IAccount } from './account.model'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { HttpStatus } from '@nestjs/common/enums'
import { RolesGuard } from '../../common/guard/role-based.guard'
import { Roles } from 'src/common/decorator/roles.decorator'
import { RolesEnum } from 'src/app/constant/app.constant'
import { ApiPath } from '../../app/constant/app.constant'
import { ICustomerService } from '../customer/customer.service'
import { Post } from '@nestjs/common/decorators'
import { Request } from 'express'

@Controller({ path: [ApiPath.BASE, ApiPath.ACCOUNTS].join('/'), version: '1' })
@UseInterceptors(TransformInterceptor<AccountRequestDto>)
export class AccountController {
  constructor(
    private readonly accountService: IAccountService,
    private readonly customerService: ICustomerService
  ) {}

  @Get()
  // @Roles(RolesEnum.ADMINISTRATOR)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ResponseMessage('Success')
  async findAll(): Promise<IAccount[]> {
    const data: any = await this.accountService.findAll()
    return data
  }

  @Post(ApiPath.BOOKING_HISTORY)
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.EMPLOYEE, RolesEnum.AUTHENTICATED_CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new JoiValidationPipe(retrieveBookingHistoryRequestSchema))
  @ResponseMessage('Success')
  async retrieveBookingHistory(@Req() request: Request) {
    const requestDto: any = request.body
    return this.accountService.retrieveBookingHistory(requestDto.accountId)
  }

  // @Get('/get/:id')
  // @ResponseMessage('Success')
  // async get(@Param('id', new ParseUUIDPipe()) id: string) {
  //   const data = await this.accountService.findOne(id)
  //   return data
  // }

  // @Post()
  // @HttpCode(201)
  // @ResponseMessage('Account Created')
  // @UsePipes(new JoiValidationPipe(accountRequestSchema))
  // async create(@Body() account: AccountRequestDto) {
  //   if (!account.role) {
  //     account.role = 'Customer'
  //   }
  //   const toBeSavedAccount: IAccount =
  //     await this.accountService.generateAccountFromRequest(account)
  //   const createdRole = this.accountService.create(toBeSavedAccount)
  //   return createdRole
  // }

  // @Put('/update/:id')
  // @ResponseMessage('Updated')
  // update(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() account: IAccount
  // ) {
  //   return this.accountService.update(id, account)
  // }

  @Delete('deactivate/:id')
  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ResponseMessage('Deactivated')
  deactivateAccount(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.accountService.deactivateAccount(id)
  }

  @Post('activate/:id')
  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ResponseMessage('Activated')
  activateAccount(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.accountService.activateAccount(id)
  }
}
