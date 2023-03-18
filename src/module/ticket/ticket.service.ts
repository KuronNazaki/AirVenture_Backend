import { BadRequestException, Injectable, Logger, Inject } from '@nestjs/common'
import { DeleteResult, UpdateResult } from 'typeorm'
import { ITicketRepository } from './ticket.repository'
import { ITicket, TicketEntity } from './ticket.model'
import { TicketRequestDto } from './ticket.dto'
import { IAircraft } from '../aircraft/aircraft.model'
import { IAirport } from '../airport/airport.model'
import { IAircraftService } from '../aircraft/aircraft.service'
import { IAirportService } from '../airport/airport.service'
import { IAccountService } from '../account/account.service'
import { ISeatService } from '../seat/seat.service'
import { ICustomerService } from '../customer/customer.service'
import { ICustomer } from '../customer/customer.model'
import { IInvoiceService } from '../invoice/invoice.service'
import { generateReservationCode } from '../../util/index'
import { TicketStatusEnum } from 'src/app/constant/app.constant'
import { IFlightService } from '../flight/flight.service'
import { forwardRef } from '@nestjs/common/utils'
import { IInvoice } from '../invoice/invoice.model'

export abstract class ITicketService {
  abstract findAll(): Promise<ITicket[]>
  abstract findOne(id: string): Promise<ITicket>
  abstract create(role: TicketRequestDto): Promise<ITicket>
  abstract update(is: string, role: TicketRequestDto): Promise<UpdateResult>
  abstract delete(id: string): Promise<DeleteResult>
  abstract bookFlight(payload: any): Promise<any>
  abstract retrieveTicketByReservationCode(reservationCode: string)
  abstract cancelTicket(reservationCode: string)
  abstract findTicketByInvoice(invoiceId: string): Promise<ITicket>
  abstract findAllTicketByInvoice(invoice: IInvoice): Promise<ITicket>
  abstract findAllPendingTicket()
}

@Injectable()
export class TicketService implements ITicketService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    @Inject(forwardRef(() => IAccountService))
    private readonly accountService: IAccountService,
    private readonly seatService: ISeatService,
    private readonly customerService: ICustomerService,
    @Inject(forwardRef(() => IInvoiceService))
    private readonly invoiceService: IInvoiceService,
    private readonly flightService: IFlightService
  ) {}
  async findAllPendingTicket() {
    return await this.ticketRepository.find({
      where: { status: TicketStatusEnum.PENDING },
      relations: {
        flight: {
          departure: true,
          arrival: true,
          aircraft: true,
        },
        seat: true,
        customer: true,
        invoice: true,
      },
    })
  }

  async findTicketByInvoice(invoiceId: string) {
    const ticket = await this.ticketRepository.findTicketByInvoiceId(invoiceId)
    console.log(ticket)
    return ticket
  }

  async findAllTicketByInvoice(invoice: IInvoice) {
    return await this.ticketRepository.findOne({
      where: { invoice },
      relations: {
        flight: {
          departure: true,
          arrival: true,
          aircraft: true,
        },
        seat: true,
        customer: true,
      },
    })
  }

  async cancelTicket(reservationCode: string) {
    let ticket = await this.ticketRepository.findTicketByReservationCode(
      reservationCode
    )
    await this.ticketRepository.update(
      { reservationCode: reservationCode },
      { status: TicketStatusEnum.CANCELLED }
    )
    await this.invoiceService.onTicketCancel(ticket.invoice.id)
    ticket = await this.ticketRepository.findTicketByReservationCode(
      reservationCode
    )
    return ticket
  }

  async retrieveTicketByReservationCode(reservationCode: string) {
    const ticket = await this.ticketRepository.findTicketByReservationCode(
      reservationCode
    )
    const flight = await this.flightService.findOne(ticket.flight.id)
    ticket.flight = flight
    return ticket
  }

  private async didCustomerBookFlight(customerId: string, flightId: string) {
    const ticket = await this.ticketRepository.findTicketByCustomerId(
      customerId,
      flightId
    )
    return ticket != null
  }

  private async didCustomerWithEmailBookFlight(
    email: string,
    flightId: string
  ) {
    const ticket = await this.ticketRepository.findTicketByEmail(
      email,
      flightId
    )
    return ticket != null
  }

  async bookFlight(payload: any): Promise<any> {
    if (payload.accountId) {
      let customer
      const account = await this.accountService.findOne(payload.accountId)
      if (payload?.customer.id) {
        if (
          await this.didCustomerBookFlight(
            payload?.customer.id,
            payload.flightId
          )
        ) {
          throw new BadRequestException('Customer already booked flight')
        }
        if (
          await this.seatService.isSeatBooked(
            payload.seatCode,
            payload.flightId
          )
        ) {
          throw new BadRequestException(
            'Seat has been booked. Please choose another'
          )
        }
        customer = await this.customerService.findOne(payload?.customer.id)
      } else {
        if (
          await this.didCustomerWithEmailBookFlight(
            payload?.customer.email,
            payload.flightId
          )
        ) {
          throw new BadRequestException(
            'There is a ticket booked with this email'
          )
        }
        if (
          await this.seatService.isSeatBooked(
            payload.seatCode,
            payload.flightId
          )
        ) {
          throw new BadRequestException(
            'Seat has been booked. Please choose another'
          )
        }
        const { firstName, lastName, gender, email, phoneNumber } =
          payload?.customer
        customer = await this.customerService.create({
          firstName,
          lastName,
          gender,
          email,
          phoneNumber,
        } as ICustomer)
      }
      const flight = await this.flightService.findOne(payload.flightId)
      const seat = await this.seatService.create(
        await this.seatService.generateSeatFromRequest({
          code: payload.seatCode,
          flightId: payload.flightId,
        })
      )
      const invoice = await this.invoiceService.create(
        await this.invoiceService.generateInvoiceFromRequest({
          accountId: account.id,
          total: payload.price,
        })
      )
      const ticket: TicketEntity = {
        reservationCode: generateReservationCode(),
        price: payload.price,
        status: TicketStatusEnum.PENDING,
        email: customer.email,
        customer: customer,
        invoice: invoice,
        seat: seat,
        flight: flight,
      } as TicketEntity
      return await this.ticketRepository.save(ticket)
    } else {
      if (
        await this.didCustomerWithEmailBookFlight(
          payload?.customer.email,
          payload.flightId
        )
      ) {
        throw new BadRequestException(
          'There is a ticket booked with this email'
        )
      }
      if (
        await this.seatService.isSeatBooked(payload.seatCode, payload.flightId)
      ) {
        throw new BadRequestException(
          'Seat has been booked. Please choose another'
        )
      }
      const { firstName, lastName, gender, email, phoneNumber } =
        payload?.customer
      const customer = await this.customerService.create({
        firstName,
        lastName,
        gender,
        email,
        phoneNumber,
      } as ICustomer)
      const flight = await this.flightService.findOne(payload.flightId)
      const seat = await this.seatService.create(
        await this.seatService.generateSeatFromRequest({
          code: payload.seatCode,
          flightId: payload.flightId,
        })
      )
      const invoice = await this.invoiceService.create(
        await this.invoiceService.generateInvoiceFromRequest({
          accountId: null,
          total: payload.price,
        })
      )
      const ticket: TicketEntity = {
        reservationCode: generateReservationCode(),
        price: payload.price,
        status: TicketStatusEnum.PENDING,
        email: payload?.customer.email,
        customer: customer,
        invoice: invoice,
        seat: seat,
        flight: flight,
      } as TicketEntity
      return await this.ticketRepository.save(ticket)
    }
  }

  async findAll(): Promise<ITicket[]> {
    return await this.ticketRepository.find({
      relations: {
        customer: {
          account: true,
        },
        flight: {
          aircraft: true,
          departure: true,
          arrival: true,
        },
        seat: {
          flight: true,
        },
        invoice: {
          account: true,
        },
      },
    })
  }

  async findOne(id: string): Promise<ITicket> {
    const fetchedRole: ITicket = await this.ticketRepository.findOneBy({
      id,
    })
    return fetchedRole
  }

  async create(role: TicketRequestDto): Promise<ITicket> {
    return await this.ticketRepository.save(role)
  }

  async update(id: string, role: TicketRequestDto): Promise<UpdateResult> {
    return await this.ticketRepository.update(id, role)
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.ticketRepository.delete(id)
  }
}
