import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RolesEnum } from 'src/app/constant/app.constant'
import { ROLES_KEY } from '../decorator/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler())
    if (!roles) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    const user = request.user
    console.log(user)
    if (!user) {
      if (roles.includes(RolesEnum.CUSTOMER)) {
        return true
      } else {
        return false
      }
    } else {
      console.log(user.role, roles)
      console.log(roles.includes(user.role))
      if (roles.includes(user.role)) return true
    }
  }
}
