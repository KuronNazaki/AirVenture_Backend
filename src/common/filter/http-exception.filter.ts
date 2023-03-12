import {
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Catch,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { logger } from 'src/util/logger'

export interface HttpExceptionResponse {
  statusCode: number
  message: string
  error: string
  timestamp: string
  path: string
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()
    const request = context.getRequest<Request>()
    const status = exception.getStatus()
    exception.initMessage()

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception?.cause?.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
