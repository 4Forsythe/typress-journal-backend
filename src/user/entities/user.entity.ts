import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'

import { PostEntity } from 'src/post/entities/post.entity'
import { CommentEntity } from 'src/comment/entities/comment.entity'

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column({
    unique: true
  })
  email: string

  @Column({ select: false })
  password: string

  @Column({ default: true })
  isActive: boolean

  @OneToMany(() => PostEntity, post => post.author, {
    eager: false,
    nullable: true
  })
  posts: PostEntity[]

  @OneToMany(() => CommentEntity, comment => comment.user, {
    eager: false,
    nullable: true
  })
  comments: CommentEntity[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
