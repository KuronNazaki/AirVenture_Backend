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
  UseGuards,
  HttpCode,
} from '@nestjs/common'
import { JoiValidationPipe } from 'src/common/pipe/joi-validation.pipe'
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor'
import { ResponseMessage } from 'src/common/decorator/response-message.decorator'
import { AccountRequestDto, accountRequestSchema } from './account.dto'
import { IAccountService } from './account.service'
import { logger } from 'src/util/logger'
import { IAccount } from './account.model'
import { IRoleService } from '../role/role.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { HttpStatus } from '@nestjs/common/enums'
import { RolesGuard } from '../../common/guard/role-based.guard'
import { Roles } from 'src/common/decorator/roles.decorator'
import { RolesEnum } from 'src/app/constant/app.constant'

@Controller({ path: 'api/accounts', version: '1' })
@UseInterceptors(TransformInterceptor<AccountRequestDto>)
// @UseFilters(HttpExceptionFilter)
export class AccountController {
  constructor(
    private readonly accountService: IAccountService,
    private readonly roleService: IRoleService
  ) {}

  @Get()
  @Roles(RolesEnum.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ResponseMessage('Success')
  async findAll(): Promise<IAccount[]> {
    const data: any = await this.accountService.findAll()
    return data
  }

  @Get('booking-history')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Success')
  async retrieveBookingHistory(@Body() requestDto: { accountId: string }) {
    return this.accountService.retrieveBookingHistory(requestDto.accountId)
  }

  // @Get(':id')
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

  // @Put(':id')
  // @ResponseMessage('Updated')
  // update(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() account: AccountRequestDto
  // ) {
  //   return this.accountService.update(id, account)
  // }

  @Delete(':id')
  @ResponseMessage('Deactivated')
  deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.accountService.deactivateAccount(id)
  }
}
