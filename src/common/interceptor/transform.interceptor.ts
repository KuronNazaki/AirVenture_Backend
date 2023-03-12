import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import { ResponseMessageKey } from '../decorator/response-message.decorator'

export interface Response<T> {
  statusCode: number
  message: string
  data: T
  timestamp: string
  path: string
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    const responseMessage =
      this.reflector.get<string>(ResponseMessageKey, context.getHandler()) ?? ''
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: data?.message ? data?.message : responseMessage,
        data: data,
        timestamp: new Date().toISOString(),
        path: context.switchToHttp().getRequest().url,
      }))
    )
  }
}
