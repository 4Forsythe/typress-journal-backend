import { IsEmail, Length } from 'class-validator'

export class CreateUserDto {
  @Length(6, 20, {
    message: 'Имя пользователя должно быть от 6 до 20 символов'
  })
  username: string

  @IsEmail(undefined, { message: 'Неверный формат почты' })
  email: string

  @Length(8, 30, { message: 'Пароль должен быть от 8 до 30 символов' })
  password: string
}
