import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { SearchCommentDto } from './dto/search-comment.dto'
import { CommentEntity } from './entities/comment.entity'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private repository: Repository<CommentEntity>
  ) {}

  async create(userId: number, dto: CreateCommentDto) {
    const response = await this.repository.save({
      content: dto.content,
      post: { id: dto.postId },
      user: { id: userId }
    })

    return this.repository.findOne({
      where: { id: response.id },
      relations: ['user']
    })
  }

  async findAll(dto: SearchCommentDto) {
    const builder = this.repository
      .createQueryBuilder('comments')
      .orderBy('comments.createdAt', dto.order || 'DESC')

    if (dto.post) {
      builder.andWhere('comments.post = :post')
    }

    if (dto.user) {
      builder.andWhere(`comments.user = :user`)
    }

    builder.setParameters({
      post: dto.post,
      user: dto.user
    })

    if (!dto.post) {
      builder.leftJoinAndSelect('comments.post', 'post')
    }

    if (!dto.user) {
      builder.leftJoinAndSelect('comments.user', 'user')
    }

    builder.skip(dto.skip || 0)
    builder.take(dto.take || 50)

    const [items, total] = await builder.getManyAndCount()

    return { items, total }
  }

  async findOne(id: number) {
    const response = await this.repository.findOne({ where: { id } })

    if (!response) {
      throw new NotFoundException('Комментарий не найден')
    }

    return response
  }

  async update(id: number, dto: UpdateCommentDto) {
    const response = await this.repository.findOne({ where: { id } })

    if (!response) {
      throw new NotFoundException('Комментарий не найден')
    }

    return this.repository.update(id, {
      content: dto.content,
      post: { id: dto.postId }
    })
  }

  async remove(id: number) {
    const response = await this.repository.findOne({ where: { id } })

    if (!response) {
      throw new NotFoundException('Комментарий не найден')
    }

    return this.repository.delete(id)
  }
}
