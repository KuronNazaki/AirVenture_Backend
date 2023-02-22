import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NODE_ENV } from 'src/app/constant/app.constant'
import { UserEntity } from 'src/user/user.entity'
import { SnakeNamingStrategy } from './strategy/snake-naming.strategy'
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [UserEntity],
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: configService.get('NODE_ENV') === NODE_ENV.DEVELOPMENT,
        logging: configService.get('NODE_ENV') === NODE_ENV.DEVELOPMENT,
        extra: { charset: 'utf8mb4_unicode_ci' },
      }),
    }),
  ],
})
export class DatabaseModule {}
