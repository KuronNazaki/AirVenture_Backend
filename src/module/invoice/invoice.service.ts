import { BadRequestException, Injectable, Logger, Inject } from '@nestjs/common'
import { DeleteResult, UpdateResult } from 'typeorm'
import { IInvoiceRepository } from './invoice.repository'
import { IInvoice } from './invoice.model'
import { InvoiceRequestDto } from './invoice.dto'
import { IAccount } from '../account/account.model'
import { IAccountService } from '../account/account.service'
import { InvoiceStatusEnum } from 'src/app/constant/app.constant'
import { ITicketService } from '../ticket/ticket.service'
import { TicketStatusEnum } from '../../app/constant/app.constant'
import { MailService } from '../mail/mail.service'
import { forwardRef } from '@nestjs/common/utils'

export abstract class IInvoiceService {
  abstract findAll(): Promise<IInvoice[]>
  abstract findOne(id: string): Promise<IInvoice>
  abstract create(role: InvoiceRequestDto): Promise<IInvoice>
  abstract update(is: string, role: InvoiceRequestDto): Promise<UpdateResult>
  abstract delete(id: string): Promise<DeleteResult>
  abstract generateInvoiceFromRequest(requestDto: InvoiceRequestDto)
  abstract onTicketCancel(id: string)
  abstract verifyTransaction(id: string)
  abstract getAllInvoiceByAccount(account: IAccount)
}

@Injectable()
export class InvoiceService implements IInvoiceService {
  private logger: Logger

  constructor(
    private readonly invoiceRepository: IInvoiceRepository,
    @Inject(forwardRef(() => IAccountService))
    private readonly accountService: IAccountService,
    private readonly ticketService: ITicketService,
    private readonly mailService: MailService
  ) {
    this.logger = new Logger()
  }

  async getAllInvoiceByAccount(account: IAccount) {
    // const invoices = await this.invoiceRepository.find({
    //   where: { account },
    //   relations: { account: true },
    // })
    const invoices = await this.invoiceRepository.findInvoiceByAccountId(
      account.id
    )
    console.log('invoice service', account, invoices)
    return invoices
  }
  async verifyTransaction(id: string) {
    let ticket = await this.ticketService.findTicketByInvoice(id)
    if (!ticket) {
      throw new BadRequestException('Invoice is not found')
    } else {
      await this.invoiceRepository.update(
        { id },
        { status: InvoiceStatusEnum.COMPLETED }
      )
      await this.ticketService.update(ticket.id, {
        status: TicketStatusEnum.ISSUED,
      })
      ticket = await this.ticketService.findTicketByInvoice(id)
      console.log(ticket)
      await this.mailService.sendTicketInformation({
        reservationCode: ticket.reservationCode,
        email: ticket.email,
      })
      return true
    }
  }
  async onTicketCancel(id: string) {
    return await this.invoiceRepository.update(
      { id },
      {
        status: InvoiceStatusEnum.FAILED,
      }
    )
  }

  async generateInvoiceFromRequest(requestDto: InvoiceRequestDto) {
    let account: IAccount
    if (requestDto.accountId) {
      account = await this.accountService.findOne(requestDto.accountId)
    } else {
      account = null
    }
    const invoice: IInvoice = {
      status: InvoiceStatusEnum.PENDING,
      account: account,
      total: requestDto.total,
    } as IInvoice
    return invoice
  }

  async findAll(): Promise<IInvoice[]> {
    return await this.invoiceRepository.find({
      relations: {
        account: true,
      },
    })
  }

  async findOne(id: string): Promise<IInvoice> {
    const fetchedRole: IInvoice = await this.invoiceRepository.findOneBy({
      id,
    })
    return fetchedRole
  }

  async create(role: InvoiceRequestDto): Promise<IInvoice> {
    return await this.invoiceRepository.save(role)
  }

  async update(id: string, role: InvoiceRequestDto): Promise<UpdateResult> {
    return await this.invoiceRepository.update(id, role)
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.invoiceRepository.delete(id)
  }
}
