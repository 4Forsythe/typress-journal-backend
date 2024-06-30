import { ExecutionContext, createParamDecorator } from '@nestjs/common'

import { UserEntity } from './entities/user.entity'

export const User = createParamDecorator(
  (_: unknown, context: ExecutionContext): UserEntity => {
    const req = context.switchToHttp().getRequest()
    return req.user.id
  }
)
