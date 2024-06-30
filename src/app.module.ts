import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { PostModule } from './post/post.module'
import { CommentModule } from './comment/comment.module'
import { CategoryModule } from './category/category.module'

import { UserEntity } from './user/entities/user.entity'
import { PostEntity } from './post/entities/post.entity'
import { CommentEntity } from './comment/entities/comment.entity'
import { CategoryEntity } from './category/entities/category.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USER') || 'postgres',
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [UserEntity, CategoryEntity, PostEntity, CommentEntity],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE') || false
      })
    }),
    UserModule,
    CategoryModule,
    PostModule,
    CommentModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
