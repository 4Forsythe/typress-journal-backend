import { Controller, Get, Param, Query } from '@nestjs/common'

import { CategoryService } from './category.service'

import { SearchCategoryDto } from './dto/search-category.dto'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(@Query() dto: SearchCategoryDto) {
    return this.categoryService.findAll(dto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id)
  }
}
