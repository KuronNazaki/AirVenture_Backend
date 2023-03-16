import { Injectable, Logger } from '@nestjs/common'
import { DeleteResult, UpdateResult } from 'typeorm'
import { ICustomerRepository } from './customer.repository'
import { ICustomer } from './customer.model'
import { CustomerRequestDto } from './customer.dto'

export abstract class ICustomerService {
  abstract findAll(): Promise<ICustomer[]>
  abstract findOne(id: string): Promise<ICustomer>
  abstract create(role: ICustomer): Promise<ICustomer>
  abstract update(is: string, role: CustomerRequestDto): Promise<UpdateResult>
  abstract delete(id: string): Promise<DeleteResult>
  abstract findOneByAccountId(accountId: string)
}

@Injectable()
export class CustomerService implements ICustomerService {
  private logger: Logger

  constructor(private readonly customerRepository: ICustomerRepository) {
    this.logger = new Logger()
  }
  async findOneByAccountId(accountId: string) {
    return await this.customerRepository.findOneByAccountId(accountId)
  }

  async findAll(): Promise<ICustomer[]> {
    return await this.customerRepository.find({
      relations: {
        account: {
          role: true,
        },
      },
    })
  }

  async findOne(id: string): Promise<ICustomer> {
    const fetchedRole: ICustomer = await this.customerRepository.findOne({
      where: { id },
      relations: {
        account: {
          role: true,
        },
      },
    })
    return fetchedRole
  }

  async create(customer: ICustomer): Promise<ICustomer> {
    return await this.customerRepository.save(customer)
  }

  async update(id: string, role: CustomerRequestDto): Promise<UpdateResult> {
    return await this.customerRepository.update(id, role)
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.customerRepository.delete(id)
  }
}
