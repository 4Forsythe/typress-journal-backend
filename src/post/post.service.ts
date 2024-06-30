import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { SearchPostDto } from './dto/search-post.dto'
import { PostEntity } from './entities/post.entity'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private repository: Repository<PostEntity>
  ) {}

  create(userId: number, dto: CreatePostDto) {
    return this.repository.save({
      title: dto.title,
      subtitle: dto.subtitle,
      content: dto.content,
      imageUrl: dto.imageUrl,
      category: { id: dto.category },
      sections: dto.sections,
      keywords: dto.keywords,
      author: { id: userId }
    })
  }

  async findAll(dto: SearchPostDto) {
    const builder = this.repository
      .createQueryBuilder('posts')
      .loadRelationCountAndMap(
        'posts.totalComments',
        'posts.comments',
        'comments'
      )

    if (dto.sortBy) {
      builder.orderBy(`posts.${dto.sortBy}`, dto.order || 'DESC')
    } else {
      builder.orderBy('posts.createdAt', dto.order || 'DESC')
    }

    if (dto.query) {
      builder.andWhere(
        `posts.title ILIKE :query OR posts.subtitle ILIKE :query OR posts.content ILIKE :query OR posts.keywords ILIKE :query`
      )
    }

    if (dto.author) {
      builder.andWhere(`posts.author = :author`)
    }

    if (dto.category) {
      builder.andWhere(`posts.category = :category`)
    }

    builder.setParameters({
      query: `%${dto.query}%`,
      author: dto.author,
      category: dto.category
    })

    if (!dto.author) {
      builder.leftJoinAndSelect('posts.author', 'author')
    }

    if (!dto.category) {
      builder.leftJoinAndSelect('posts.category', 'category')
    }

    builder.skip(dto.skip || 0)
    builder.take(dto.take || 50)

    const [items, total] = await builder.getManyAndCount()

    return { items, total }
  }

  async findOne(id: number) {
    const builder = this.repository.createQueryBuilder('post')

    const response = await builder
      .where('post.id = :id', { id })
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .loadRelationCountAndMap('post.totalComments', 'post.comments')
      .getOne()

    if (!response) {
      throw new NotFoundException('Статья не найдена')
    }

    await builder
      .update()
      .set({ views: () => 'views + 1' })
      .where('id = :id', { id })
      .execute()

    return response
  }

  async update(id: number, dto: UpdatePostDto, userId: number) {
    const response = await this.repository.findOne({ where: { id } })

    if (!response) {
      throw new NotFoundException('Статья не найдена')
    }

    return this.repository.update(id, {
      title: dto.title,
      subtitle: dto.subtitle,
      content: dto.content,
      category: { id: dto.category },
      sections: dto.sections,
      keywords: dto.keywords,
      author: { id: userId }
    })
  }

  async remove(id: number, userId: number) {
    const response = await this.repository.findOne({ where: { id } })

    if (!response) {
      throw new NotFoundException('Статья не найдена')
    }

    if (response.author.id !== userId) {
      throw new ForbiddenException('У пользователя нет доступа к этой статье')
    }

    return this.repository.delete(id)
  }
}
