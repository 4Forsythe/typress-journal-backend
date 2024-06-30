import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

import { UserService } from 'src/user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        '3$+lO#x1Z8q!Fb*7&5~@9Kd^E^6uNcG'
    })
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.userService.findOne(payload.sub)

    if (!user) {
      throw new UnauthorizedException('Нет доступа к пользователю')
    }

    return user
  }
}
