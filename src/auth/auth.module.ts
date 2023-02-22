import { Module } from '@nestjs/common'
import { GoogleStrategy } from './google.strategy'
import { AuthService, IAuthService } from './auth.service'
import { AuthController } from './auth.controller'

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [{ provide: IAuthService, useClass: AuthService }, GoogleStrategy],
})
export class AuthModule {}
