import { Module } from '@nestjs/common'
import { IUserService, UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { IUserRepository, UserRepository } from './user.repository'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: IUserService,
      useClass: UserService,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  controllers: [UserController],
  exports: [IUserService],
})
export class UserModule {}
