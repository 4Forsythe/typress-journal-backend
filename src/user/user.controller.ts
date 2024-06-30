import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query
} from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { UserService } from './user.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { SearchUserDto } from './dto/search-user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() dto: SearchUserDto) {
    return this.userService.findAll(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return this.userService.findOne(req.user.id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  update(@Request() req, @Body() dto: UpdateUserDto) {
    return this.userService.update(+req.user.id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }
}
