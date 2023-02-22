import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { AuthModule } from '../auth/auth.module'
import { LoggerMiddleware } from '../middleware/logger.middleware'
import { ConfigModule } from '@nestjs/config'
import * as Joi from '@hapi/joi'
import { NODE_ENV } from './constant/app.constant'
import { DatabaseModule } from 'src/database'

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        NODE_ENV: Joi.string()
          .required()
          .valid(NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required().allow(''),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'root',
    //   database: 'airventure',
    //   entities: [User],
    //   synchronize: true,
    // }),
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
