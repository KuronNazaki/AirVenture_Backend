import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const reflector = app.get(Reflector)
  const configService = app.get(ConfigService)
  const PORT = +configService.get<number>('PORT')

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  await app.listen(PORT)
}
bootstrap()
