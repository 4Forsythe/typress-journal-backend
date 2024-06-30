import { IsEmail, Length } from 'class-validator'

export class LoginUserDto {
  @IsEmail(undefined, { message: 'Неверный формат почты' })
  email: string

  @Length(8, 30, { message: 'Пароль должен быть от 8 до 30 символов' })
  password: string
}
