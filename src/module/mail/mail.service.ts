import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ITicketService } from '../ticket/ticket.service'
import { ITicket } from '../ticket/ticket.model'
import { IFlight } from '../flight/flight.model'
import { IFlightService } from '../flight/flight.service'

export interface User {
  email: string
  name: string
}

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private ticketService: ITicketService,
    private flightService: IFlightService
  ) {}

  async sendTicketInformation(requestDto: {
    reservationCode: string
    email: string
  }) {
    const ticket: ITicket =
      await this.ticketService.retrieveTicketByReservationCode(
        requestDto.reservationCode
      )
    const flight: IFlight = await this.flightService.findOne(ticket.flight.id)
    ticket.flight = flight
    if (!requestDto.email) {
      requestDto.email = ticket.email
    }
    await this.mailerService.sendMail({
      to: requestDto.email,
      subject: 'AirVenture | Ticket Information',
      template: './ticket-information',
      context: {
        firstName: ticket.customer.firstName,
        lastName: ticket.customer.lastName,
        gender: ticket.customer.gender,
        phoneNumber: ticket.customer.phoneNumber,
        reservationCode: requestDto.reservationCode,
        seatCode: ticket.seat.code,
        departureName: (ticket.flight.departure as any).name,
        arrivalName: (ticket.flight.arrival as any).name,
        departTime: ticket.flight.departTime.toLocaleString(),
        arriveTime: ticket.flight.arriveTime.toLocaleString(),
        boardingGate: ticket.flight.boardingGate,
        price: ticket.price,
      },
    })
  }

  async sendPaymentInformation(requestDto: {
    reservationCode: string
    email: string
  }) {
    const ticket: ITicket =
      await this.ticketService.retrieveTicketByReservationCode(
        requestDto.reservationCode
      )
    const flight: IFlight = await this.flightService.findOne(ticket.flight.id)
    ticket.flight = flight
    if (!requestDto.email) {
      requestDto.email = ticket.email
    }
    await this.mailerService.sendMail({
      to: requestDto.email,
      subject: 'AirVenture | Payment Information',
      template: './payment-information',
      context: {
        firstName: ticket.customer.firstName,
        lastName: ticket.customer.lastName,
        reservationCode: requestDto.reservationCode,
        seatCode: ticket.seat.code,
        price: ticket.price,
      },
    })
  }
}
