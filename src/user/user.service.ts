import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { SearchUserDto } from './dto/search-user.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>
  ) {}

  async create(dto: CreateUserDto) {
    const response = await this.repository.findOne({
      where: { email: dto.email }
    })

    if (response) {
      throw new UnauthorizedException('Такой пользователь уже существует')
    }

    return this.repository.save(dto)
  }

  async findAll(dto: SearchUserDto) {
    const builder = this.repository
      .createQueryBuilder('users')
      .loadRelationCountAndMap('users.totalPosts', 'users.posts', 'posts')
      .loadRelationCountAndMap(
        'users.totalComments',
        'users.comments',
        'comments'
      )

    if (dto.email) {
      builder.andWhere(`u.email ILIKE :email`)
    }

    if (dto.username) {
      builder.andWhere(`u.username ILIKE :username`)
    }

    builder.setParameters({
      email: `%${dto.email}%`,
      username: `%${dto.username}%`
    })

    builder.limit(dto.offset || 0)
    builder.take(dto.limit || 10)

    const [items, total] = await builder.getManyAndCount()

    return { items, total }
  }

  async findOne(id: number) {
    const response = await this.repository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .loadRelationCountAndMap('user.totalPosts', 'user.posts')
      .loadRelationCountAndMap('user.totalComments', 'user.comments')
      .getOne()

    if (!response) {
      throw new NotFoundException('Пользователь не найден')
    }

    return response
  }

  async findCondition(object: LoginUserDto) {
    const response = await this.repository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: object.email })
      .andWhere('user.password = :password', { password: object.password })
      .addSelect('user.password')
      .getOne()

    return response
  }

  async update(id: number, dto: UpdateUserDto) {
    const response = await this.repository.findOne({ where: { id } })

    if (!response) {
      throw new NotFoundException('Пользователь не найден')
    }

    return this.repository.update(id, dto)
  }

  async remove(id: number) {
    const response = await this.repository.findOne({ where: { id } })

    if (!response) {
      throw new NotFoundException('Пользователь не найден')
    }

    return this.repository.delete(id)
  }
}
