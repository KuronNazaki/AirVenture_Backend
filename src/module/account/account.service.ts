/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, Logger, Inject } from '@nestjs/common'
import { DeleteResult, UpdateResult } from 'typeorm'
import { IAccountRepository } from './account.repository'
import { AccountRequestDto } from './account.dto'
import { IAccount } from './account.model'
import { IRoleService } from 'src/module/role/role.service'
import { logger } from 'src/util/logger'
import { IInvoiceService } from '../invoice/invoice.service'
import { ITicketService } from '../ticket/ticket.service'
import { forwardRef } from '@nestjs/common/utils'
import { IFlightService } from '../flight/flight.service'
const bcrypt = require('bcrypt')

export abstract class IAccountService {
  abstract findAll(): Promise<IAccount[]>
  abstract findOne(id: string): Promise<IAccount>
  abstract create(account: IAccount): Promise<IAccount>
  abstract update(is: string, account: IAccount): Promise<UpdateResult>
  abstract delete(id: string): Promise<DeleteResult>
  abstract generateAccountFromRequest(
    requestDto: AccountRequestDto
  ): Promise<IAccount>
  abstract getAccountByEmail(email: string): Promise<IAccount>
  abstract retrieveBookingHistory(accountId: string)
  abstract deactivateAccount(accountId: string)
}

@Injectable()
export class AccountService implements IAccountService {
  private logger: Logger

  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly roleService: IRoleService,
    @Inject(forwardRef(() => IInvoiceService))
    private readonly invoiceService: IInvoiceService,
    private readonly ticketService: ITicketService,
    private readonly flightService: IFlightService
  ) {
    this.logger = new Logger()
  }
  async deactivateAccount(id: string) {
    return await this.accountRepository.update(id, { isActive: false })
  }

  async retrieveBookingHistory(accountId: string) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    })
    let invoices = await this.invoiceService.getAllInvoiceByAccount(account)
    invoices = await Promise.all(
      invoices.map(async (invoice) => {
        const ticket = await this.ticketService.findTicketByInvoice(invoice.id)
        if (!ticket) {
          return null
        }
        ticket.flight = await this.flightService.findOne(ticket.flight.id)
        return {
          invoice: invoice,
          ticket: ticket,
        }
      })
    )
    return invoices
  }

  async getAccountByEmail(email: string): Promise<IAccount> {
    return await this.accountRepository.findOne({
      where: { email },
      relations: { role: true },
    })
  }

  async generateAccountFromRequest(
    requestDto: AccountRequestDto
  ): Promise<IAccount> {
    try {
      if (!requestDto.role) {
        requestDto.role = 'Customer'
      }
      const role = await this.roleService.findOneByName(requestDto.role)
      let salt, hashedPassword
      if (requestDto.password) {
        const saltRounds = 10
        salt = await bcrypt.genSalt(saltRounds)
        hashedPassword = await bcrypt.hash(requestDto.password, salt)
      }
      const account: IAccount = {
        ...requestDto,
        role: role,
        salt: salt,
        password: hashedPassword,
        isActive: true,
      } as IAccount
      return account
    } catch (error) {
      logger.error(error)
    }
  }

  async findAll(): Promise<IAccount[]> {
    return await this.accountRepository.find({ relations: { role: true } })
  }

  async findOne(id: string): Promise<IAccount> {
    const fetchedUser: IAccount = await this.accountRepository.findOne({
      where: { id },
      relations: { role: true },
    })
    return fetchedUser
  }

  async create(account: IAccount): Promise<IAccount> {
    return await this.accountRepository.save(account)
  }

  async update(id: string, account: IAccount): Promise<UpdateResult> {
    return await this.accountRepository.update(id, account)
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.accountRepository.delete(id)
  }
}
