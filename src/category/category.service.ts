import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { SearchCategoryDto } from './dto/search-category.dto'
import { CategoryEntity } from './entities/category.entity'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private repository: Repository<CategoryEntity>
  ) {}

  async findAll(dto: SearchCategoryDto) {
    const builder = this.repository.createQueryBuilder('categories')

    if (dto.sortBy === 'random') {
      builder.orderBy('RANDOM()')
    } else {
      builder.orderBy('categories.title', dto.order || 'ASC')
    }

    builder.skip(dto.skip || 0)
    builder.take(dto.take || 50)

    const [items, total] = await builder.getManyAndCount()

    return { items, total }
  }

  async findOne(id: number) {
    const response = await this.repository.findOne({ where: { id } })

    if (!response) {
      throw new NotFoundException('Категория не найдена')
    }

    return response
  }
}
