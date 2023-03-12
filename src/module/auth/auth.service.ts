/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { logger } from 'src/util/logger'
import { IAccountService } from '../account/account.service'
import { JwtService } from '@nestjs/jwt'
const bcrypt = require('bcrypt')

export abstract class IAuthService {
  abstract googleLogin(req)
  abstract validateAccount(email: string, password: string)
  abstract login(account: any)
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly accountService: IAccountService,
    private jwtService: JwtService
  ) {}

  googleLogin(request) {
    if (!request.user) {
      throw new UnauthorizedException('Unauthorized', {
        cause: new Error(),
        description: 'Google account not found',
      })
    }

    return this.login(request.user)
  }

  async validateAccount(email: string, password: string): Promise<any> {
    const account = await this.accountService.getAccountByEmail(email)
    if (account) {
      if (account.isActive) {
        const result = await this.compareAsync(password, account.password)
        if (result) {
          return account
        } else {
          return null
        }
      } else {
        throw new UnauthorizedException('Account has been deactivated')
      }
    } else {
      throw new UnauthorizedException('Incorrect email or password')
    }
  }

  async login(account: any) {
    let payload: any
    console.log(account)
    if (account.googleId) {
      payload = {
        email: account.email,
        id: account.id,
        googleId: account.googleId,
        role: account?.role?.name,
      }
      return {
        accessToken: this.jwtService.sign(payload),
        isLoggedInWithGoogle: true,
      }
    } else {
      payload = {
        email: account.email,
        id: account.id,
        role: account?.role?.name,
      }
      return {
        accessToken: this.jwtService.sign(payload),
        idLoggedInWithGoogle: false,
      }
    }
  }

  private compareAsync(password: string, hash: string) {
    return new Promise<boolean>(function (resolve, reject) {
      bcrypt.compare(password, hash, function (error, result) {
        if (error) {
          reject(error)
        }
        if (result) {
          resolve(result)
        } else {
          resolve(null)
        }
      })
    })
  }
}
