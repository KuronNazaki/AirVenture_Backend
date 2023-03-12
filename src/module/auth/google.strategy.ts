import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const Strategy = require('passport-google-oauth20-with-people-api').Strategy
import { config } from 'dotenv'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { IAccountService } from '../account/account.service'
import { IAccount } from '../account/account.model'
import { AccountRequestDto } from '../account/account.dto'
import { ICustomerService } from '../customer/customer.service'
import { ICustomer } from '../customer/customer.model'

config()

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly accountService: IAccountService,
    private readonly customerService: ICustomerService
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: [
        'email',
        'profile',
        // 'https://www.googleapis.com/auth/user.phonenumbers.read',
        // 'https://www.googleapis.com/auth/user.gender.read',
      ],
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const { name, emails, photos, id, phones, gender } = profile
    console.log(profile)
    console.log(phones, gender)
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    }
    let account: IAccount = await this.accountService.getAccountByEmail(
      emails[0].value
    )
    if (account) {
      await this.accountService.update(account.id, {
        ...account,
        image: photos[0].value,
        googleId: id,
      })
      account = await this.accountService.getAccountByEmail(emails[0].value)
      if (account.isActive) {
        done(null, account)
      } else {
        throw new UnauthorizedException('Account has been deactivated')
      }
    } else {
      let newAccount: IAccount =
        await this.accountService.generateAccountFromRequest({
          email: emails[0].value,
          isActive: true,
          role: 'Customer',
          image: photos[0].value,
          googleId: id,
        })
      newAccount = await this.accountService.create(newAccount)
      const finalAccount = await this.customerService.create({
        firstName: name.givenName,
        lastName: name.familyName,
        gender: null,
        phoneNumber: null,
        account: newAccount,
        email: emails[0].value,
      } as ICustomer)
      done(null, await this.accountService.findOne(finalAccount.account.id))
    }
    // done(null, user)
  }
}
