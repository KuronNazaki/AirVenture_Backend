import { Injectable } from '@nestjs/common'

export abstract class IAuthService {
  abstract googleLogin(req)
}

@Injectable()
export class AuthService implements IAuthService {
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }

    return {
      message: 'User information from google',
      user: req.user,
    }
  }
}
