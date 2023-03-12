import { Module } from '@nestjs/common'
import { IRoleService, RoleService } from './role.service'
import { RoleController } from './role.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IRoleRepository, RoleRepository } from './role.repository'
import { RoleEntity } from './role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [
    {
      provide: IRoleService,
      useClass: RoleService,
    },
    {
      provide: IRoleRepository,
      useClass: RoleRepository,
    },
  ],
  controllers: [RoleController],
  exports: [IRoleService],
})
export class RoleModule {}
