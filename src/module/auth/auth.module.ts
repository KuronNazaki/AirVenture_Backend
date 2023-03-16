import { Module } from '@nestjs/common'
import { GoogleStrategy } from './google.strategy'
import { AuthService, IAuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { AccountModule } from '../account/account.module'
import { CustomerModule } from '../customer/customer.module'
import { LocalStrategy } from './local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { JWT_SECRET } from 'src/app/constant/app.constant'
import { JwtStrategy } from './jwt.strategy'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    AccountModule,
    CustomerModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1800s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: IAuthService, useClass: AuthService },
    GoogleStrategy,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
