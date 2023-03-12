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
import { TicketRequestDto, ticketRequestSchema } from './ticket.dto'
import { ITicket } from './ticket.model'
import { ITicketService } from './ticket.service'
import { MailService } from '../mail/mail.service'

@Controller({ path: 'api/tickets', version: '1' })
@UseInterceptors(TransformInterceptor<TicketRequestDto>)
export class TicketController {
  private logger: Logger

  constructor(
    private readonly ticketService: ITicketService,
    private readonly mailService: MailService
  ) {
    this.logger = new Logger()
  }

  @Get('retrieve')
  @ResponseMessage('Success')
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
  @ResponseMessage('Role Created')
  async create(@Body() flightRequest: TicketRequestDto) {
    // const createdRole = await this.ticketService.create(
    //   await this.ticketService.generateFlightFromRequest(flightRequest)
    // )
    // return createdRole
    return await this.ticketService.bookFlight(flightRequest)
  }

  @Post('cancel')
  @ResponseMessage('Ticket Cancelled')
  async cancelTicket(@Body() requestDto: { reservationCode: string }) {
    return this.ticketService.cancelTicket(requestDto.reservationCode)
  }

  @Post('send-email')
  @ResponseMessage('Sent')
  async sendEmail(
    @Body() requestDto: { reservationCode: string; email: string }
  ) {
    return this.mailService.sendTicketInformation(requestDto)
  }

  @Put(':id')
  @ResponseMessage('Updated')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() role: TicketRequestDto
  ) {
    return this.ticketService.update(id, role)
  }

  @Delete(':id')
  @ResponseMessage('Deleted')
  deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ticketService.delete(id)
  }
}
