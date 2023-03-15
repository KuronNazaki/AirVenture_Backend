import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { JWT_SECRET } from 'src/app/constant/app.constant'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    })
  }

  async validate(payload: any) {
    console.log(payload)
    if (payload.googleId) {
      return {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        googleId: payload.googleId,
      }
    } else {
      return { id: payload.id, role: payload.role, email: payload.email }
    }
  }
}
