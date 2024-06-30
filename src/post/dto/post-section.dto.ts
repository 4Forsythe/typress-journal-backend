import { Length } from 'class-validator'

export class PostSectionDto {
  @Length(5, 70, {
    message: 'Заголовок раздела должен быть от 5 до 70 символов'
  })
  title: string

  @Length(32, 720, {
    message: 'Содержание раздела должено быть от 5 до 70 символов'
  })
  content: string
}
