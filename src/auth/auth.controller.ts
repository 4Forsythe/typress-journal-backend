import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common'

import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto)
  }
}
