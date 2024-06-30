import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'

import { UserEntity } from 'src/user/entities/user.entity'
import { PostEntity } from 'src/post/entities/post.entity'

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content: string

  @ManyToOne(() => PostEntity, {
    nullable: false
  })
  @JoinColumn({ name: 'postId' })
  post: PostEntity

  @ManyToOne(() => UserEntity, {
    eager: true,
    nullable: false
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
