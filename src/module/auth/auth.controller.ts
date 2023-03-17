import {
  Controller,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  Post,
  UseFilters,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request, Response } from 'express'
import { IAuthService } from './auth.service'
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor'
import { ApiPath } from 'src/app/constant/app.constant'
import {
  RegisterRequestDto,
  registerRequestSchema,
} from './register-request.dto'
import { AccountRequestDto } from '../account/account.dto'
import { IAccountService } from '../account/account.service'
import { ICustomerService } from '../customer/customer.service'
import { ICustomer } from '../customer/customer.model'
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter'
import { logger } from 'src/util/logger'
import { RolesEnum } from '../../app/constant/app.constant'
import { ResponseMessage } from 'src/common/decorator/response-message.decorator'
import { UsePipes } from '@nestjs/common/decorators'
import { JoiValidationPipe } from 'src/common/pipe/joi-validation.pipe'
import { GoogleAuthGuard } from './google-auth.guard'

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
  async googleAuth(@Req() request, @Res() response) {
    response.header('Access-Control-Allow-Origin', '*')
    return
  }

  @Get(ApiPath.GOOGLE_REDIRECT)
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() request: Request, @Res() response: Response) {
    logger.debug(request.user)
    this.authService.googleLogin(request).then((token) => {
      response.redirect('http://localhost:3006/login/' + token.accessToken)
    })
  }

  @Post(ApiPath.REGISTER)
  @UsePipes(new JoiValidationPipe(registerRequestSchema))
  @ResponseMessage('Registered')
  async register(
    @Body()
    requestDto: {
      email: string
      password: string
      role: string
      firstName: string
      lastName: string
      gender: string
      phoneNumber: string
    }
  ) {
    let account = await this.accountService.getAccountByEmail(requestDto.email)
    if (!account) {
      const accountRequest: AccountRequestDto = {
        email: requestDto.email,
        password: requestDto.password,
        role: requestDto.role
          ? requestDto.role
          : RolesEnum.AUTHENTICATED_CUSTOMER,
      }
      account = await this.accountService.generateAccountFromRequest(
        accountRequest
      )
      account = await this.accountService.create(account)
      const finalAccount = await this.customerService.create({
        firstName: requestDto.firstName,
        lastName: requestDto.lastName,
        gender: requestDto.gender,
        phoneNumber: requestDto.phoneNumber,
        email: requestDto.email,
        account: account,
      } as ICustomer)
      return finalAccount
    } else {
      throw new BadRequestException('Account is not available')
    }
  }

  @Post(ApiPath.LOGIN)
  @UseGuards(AuthGuard('local'))
  async login(@Req() request: Request) {
    return this.authService.login(request.user)
  }
}
