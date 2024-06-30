import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  Length,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'

import { PostSectionDto } from './post-section.dto'

export class CreatePostDto {
  @Length(5, 100, {
    message: 'Заголовок статьи должен быть от 5 до 100 символов'
  })
  title: string

  @IsOptional()
  @Length(0, 480, {
    message: 'Подзаголовок статьи должен быть до 480 символов'
  })
  subtitle?: string

  @Length(32, 1180, {
    message: 'Содержимое статьи должно быть от 32 до 1180 символов'
  })
  content: string

  @IsOptional()
  @Length(4, 100, {
    message: 'Адрес изображения должен быть от 4 до 100 символов'
  })
  imageUrl?: string

  @IsNotEmpty({ message: 'У статьи должна быть категория' })
  category: number

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostSectionDto)
  sections?: PostSectionDto[]

  @IsOptional()
  @IsArray()
  keywords?: string[]
}
