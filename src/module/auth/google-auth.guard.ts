import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  canActivate(context: ExecutionContext) {
    const http = context.switchToHttp()
    const res = http.getResponse()
    res.header('Access-Control-Allow-Origin', '*')
    const req = http.getRequest()
    req.res = res
    return super.canActivate(context)
  }
}
