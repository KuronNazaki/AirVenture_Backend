import {
  Body,
  Controller,
  Get,
  Post,
  Logger,
  UsePipes,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common'
import { JoiValidationPipe } from 'src/common/pipe/joi-validation.pipe'
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor'
import { ResponseMessage } from 'src/common/decorator/response-message.decorator'
import {
  TicketRequestDto,
  ticketRequestSchema,
  retrieveTicketRequestSchema,
  BookTicketRequestDto,
  cancelTicketRequestSchema,
  sendEmailRequestSchema,
} from './ticket.dto'
import { ITicket } from './ticket.model'
import { ITicketService } from './ticket.service'
import { MailService } from '../mail/mail.service'
import { Roles } from 'src/common/decorator/roles.decorator'
import { RolesEnum, ApiPath } from '../../app/constant/app.constant'
import { UseGuards } from '@nestjs/common/decorators'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from 'src/common/guard/role-based.guard'

@Controller({ path: [ApiPath.BASE, ApiPath.TICKETS].join('/'), version: '1' })
@UseInterceptors(TransformInterceptor<TicketRequestDto>)
export class TicketController {
  constructor(
    private readonly ticketService: ITicketService,
    private readonly mailService: MailService
  ) {}

  @Post(ApiPath.RETRIEVE)
  @ResponseMessage('Success')
  @UsePipes(new JoiValidationPipe(retrieveTicketRequestSchema))
  retrieveTicket(
    @Body() requestDto: { reservationCode: string }
  ): Promise<ITicket[]> {
    return this.ticketService.retrieveTicketByReservationCode(
      requestDto.reservationCode
    )
  }

  // @Get(':id')
  // @ResponseMessage('Success')
  // async get(@Param('id', new ParseUUIDPipe()) id: string) {
  //   const data = await this.ticketService.findOne(id)
  //   return data
  // }

  @Post()
  @HttpCode(201)
  @UsePipes(new JoiValidationPipe(ticketRequestSchema))
  @ResponseMessage('Success')
  async create(@Body() flightRequest: BookTicketRequestDto) {
    return await this.ticketService.bookFlight(flightRequest)
  }

  @Post(ApiPath.CANCEL)
  @UsePipes(new JoiValidationPipe(cancelTicketRequestSchema))
  @ResponseMessage('Ticket Cancelled')
  async cancelTicket(@Body() requestDto: { reservationCode: string }) {
    return this.ticketService.cancelTicket(requestDto.reservationCode)
  }

  @Post(ApiPath.SEND_EMAIL)
  @UsePipes(new JoiValidationPipe(sendEmailRequestSchema))
  @ResponseMessage('Email sent')
  async sendEmail(
    @Body() requestDto: { reservationCode: string; email: string }
  ) {
    return this.mailService.sendTicketInformation(requestDto)
  }

  @Post(ApiPath.SEND_PAYMENT_EMAIL)
  @Roles(RolesEnum.EMPLOYEE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new JoiValidationPipe(sendEmailRequestSchema))
  @ResponseMessage('Email sent')
  async sendPaymentInformationEmail(
    @Body() requestDto: { reservationCode: string; email: string }
  ) {
    return this.mailService.sendPaymentInformation(requestDto)
  }

  // @Put(':id')
  // @ResponseMessage('Updated')
  // update(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() role: TicketRequestDto
  // ) {
  //   return this.ticketService.update(id, role)
  // }

  // @Delete(':id')
  // @ResponseMessage('Deleted')
  // deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.ticketService.delete(id)
  // }
}
