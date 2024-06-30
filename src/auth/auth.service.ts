import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserService } from 'src/user/user.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UserEntity } from 'src/user/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findCondition({
      email,
      password
    })

    if (user && user.password === password) {
      const { password, ...result } = user
      return result
    }

    throw new UnauthorizedException('Неверные данные для входа')
  }

  async login(user: UserEntity) {
    const { password, ...data } = user
    const payload = { email: user.email, sub: user.id }

    return {
      ...data,
      token: this.jwtService.sign(payload)
    }
  }

  async register(dto: CreateUserDto) {
    const { password, ...user } = await this.userService.create({
      username: dto.username,
      email: dto.email,
      password: dto.password
    })

    return {
      ...user,
      token: this.jwtService.sign(user)
    }
  }
}
