import { Length, IsNotEmpty } from 'class-validator'

export class CreateCommentDto {
  @Length(6, 150, {
    message: 'Комментарий должен быть длиной от 6 до 150 символов'
  })
  content: string

  @IsNotEmpty({ message: 'У комментария должена быть статья' })
  postId: number
}
