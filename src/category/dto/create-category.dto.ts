import { Length } from 'class-validator'

export class CreateCategoryDto {
  @Length(2, 40, {
    message: 'Название категории должно быть от 2 до 40 символов'
  })
  title: string

  @Length(4, 100, {
    message: 'Адрес иконки должен быть от 4 до 100 символов'
  })
  icon: string

  @Length(4, 100, {
    message: 'Адрес изображения должен быть от 4 до 100 символов'
  })
  imageUrl: string

  @Length(10, 250, {
    message: 'Описание категории должно быть от 10 до 250 символов'
  })
  description: string
}
