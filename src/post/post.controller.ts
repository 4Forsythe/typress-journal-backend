import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { PostService } from './post.service'
import { User } from 'src/user/user.decorator'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { SearchPostDto } from './dto/search-post.dto'

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@User() userId: number, @Body() dto: CreatePostDto) {
    return this.postService.create(userId, dto)
  }

  @Get()
  findAll(@Query() dto: SearchPostDto) {
    return this.postService.findAll(dto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @User() userId: number,
    @Param('id') id: string,
    @Body() dto: UpdatePostDto
  ) {
    return this.postService.update(+id, dto, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@User() userId: number, @Param('id') id: string) {
    return this.postService.remove(+id, userId)
  }
}
