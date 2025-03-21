import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PostController } from './post.controller'
import { PostService } from './post.service'
import { PostEntity } from './entities/post.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
