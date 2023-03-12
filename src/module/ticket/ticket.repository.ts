import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ITicket, TicketEntity } from './ticket.model'
import { FlightEntity } from '../flight/flight.model'
import { SeatEntity } from '../seat/seat.model'
import { InvoiceEntity } from '../invoice/invoice.model'
import { CustomerEntity } from '../customer/customer.model'
import { AirportEntity } from '../airport/airport.model'

export abstract class ITicketRepository extends Repository<TicketEntity> {
  abstract findTicketByCustomerId(customerId: string, flightId: string)
  abstract findTicketByEmail(email: string, flightId: string)
  abstract findTicketByReservationCode(reservationCode: string)
  abstract findTicketByInvoiceId(invoiceId: string)
}

@Injectable()
export class TicketRepository extends ITicketRepository {
  async findTicketByInvoiceId(invoiceId: string) {
    return await this.dataSource
      .createQueryBuilder(TicketEntity, 'ticket')
      .innerJoinAndMapOne(
        'ticket.customer',
        CustomerEntity,
        'customer',
        'customer.id = ticket.customer_id'
      )
      .innerJoinAndMapOne(
        'ticket.flight',
        FlightEntity,
        'fl',
        'fl.id = ticket.flight_id'
      )
      .innerJoinAndMapOne(
        'ticket.seat',
        SeatEntity,
        'seat',
        'seat.id = ticket.seat_id'
      )
      .innerJoinAndMapOne(
        'ticket.invoice',
        InvoiceEntity,
        'invoice',
        'invoice.id = ticket.invoice_id'
      )
      .where('ticket.invoice_id = :invoiceId', { invoiceId })
      .getOne()
  }
  async findTicketByReservationCode(reservationCode: string) {
    return await this.dataSource
      .createQueryBuilder(TicketEntity, 'ticket')
      .innerJoinAndMapOne(
        'ticket.customer',
        CustomerEntity,
        'customer',
        'customer.id = ticket.customer_id'
      )
      .innerJoinAndMapOne(
        'ticket.flight',
        FlightEntity,
        'fl',
        'fl.id = ticket.flight_id'
      )
      .innerJoinAndMapOne(
        'ticket.seat',
        SeatEntity,
        'seat',
        'seat.id = ticket.seat_id'
      )
      .innerJoinAndMapOne(
        'ticket.invoice',
        InvoiceEntity,
        'invoice',
        'invoice.id = ticket.invoice_id'
      )
      .where('ticket.reservation_code = :reservationCode', { reservationCode })
      .getOne()
  }
  async findTicketByEmail(email: string, flightId: string) {
    return await this.dataSource
      .createQueryBuilder(TicketEntity, 'ticket')
      .where('ticket.email = :email AND ticket.flight_id = :flightId', {
        email,
        flightId,
      })
      .getOne()
  }
  async findTicketByCustomerId(customerId: string, flightId: string) {
    return await this.dataSource
      .createQueryBuilder(TicketEntity, 'ticket')
      .where(
        'ticket.customer_id = :customerId AND ticket.flight_id = :flightId',
        { customerId, flightId }
      )
      .getOne()
  }
  constructor(private dataSource: DataSource) {
    super(TicketEntity, dataSource.createEntityManager())
  }
}
