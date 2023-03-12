import {
  Controller,
  Get,
  Body,
  Req,
  UseGuards,
  Post,
  UseFilters,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { IAuthService } from './auth.service'
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor'
import { ApiPath } from 'src/app/constant/app.constant'
import { RegisterRequestDto } from './register-request.dto'
import { AccountRequestDto } from '../account/account.dto'
import { IAccountService } from '../account/account.service'
import { ICustomerService } from '../customer/customer.service'
import { ICustomer } from '../customer/customer.model'
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter'
import { logger } from 'src/util/logger'

@Controller({ path: [ApiPath.BASE, ApiPath.AUTH].join('/'), version: '1' })
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(
    private readonly authService: IAuthService,
    private readonly accountService: IAccountService,
    private readonly customerService: ICustomerService
  ) {}

  @Get(ApiPath.GOOGLE)
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() request) {
    return
  }

  @Get(ApiPath.GOOGLE_REDIRECT)
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() request: Request) {
    logger.debug(request.user)
    return this.authService.googleLogin(request)
  }

  @Post(ApiPath.REGISTER)
  async register(@Body() registerRequest: RegisterRequestDto) {
    let account = await this.accountService.getAccountByEmail(
      registerRequest.email
    )
    if (!account) {
      const accountRequest: AccountRequestDto = {
        email: registerRequest.email,
        password: registerRequest.password,
        role: 'Customer',
      }
      account = await this.accountService.generateAccountFromRequest(
        accountRequest
      )
      account = await this.accountService.create(account)
      const finalAccount = await this.customerService.create({
        firstName: registerRequest.firstName,
        lastName: registerRequest.lastName,
        gender: registerRequest.gender,
        phoneNumber: registerRequest.phoneNumber,
        email: registerRequest.email,
        account: account,
      } as ICustomer)
      return finalAccount
    } else {
      throw new BadRequestException('Account is not available')
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() request: Request) {
    return this.authService.login(request.user)
  }
}
