import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app'
import { logger } from './util/logger'
import { HttpExceptionFilter } from './common/filter/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const reflector = app.get(Reflector)
  const configService = app.get(ConfigService)
  const PORT = +configService.get<number>('PORT')
  app.enableVersioning({
    type: VersioningType.URI,
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))
  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(PORT, () =>
    logger.log(`Nest server is running on port ${PORT}`)
  )
}
bootstrap()
