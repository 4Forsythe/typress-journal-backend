import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm'

import { PostSectionDto } from '../dto/post-section.dto'
import { UserEntity } from 'src/user/entities/user.entity'
import { CommentEntity } from 'src/comment/entities/comment.entity'
import { CategoryEntity } from 'src/category/entities/category.entity'

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ nullable: true })
  subtitle?: string

  @Column()
  content: string

  @Column({ nullable: true })
  imageUrl?: string

  @Column({ default: 0 })
  views: number

  @Column({ type: 'jsonb', nullable: true })
  sections?: PostSectionDto[]

  @Column('simple-array', { nullable: true })
  keywords?: string[]

  @ManyToOne(() => CategoryEntity, {
    eager: true,
    nullable: false
  })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity

  @ManyToOne(() => UserEntity, {
    eager: true,
    nullable: false
  })
  @JoinColumn({ name: 'userId' })
  author: UserEntity

  @OneToMany(() => CommentEntity, comment => comment.post, {
    eager: false,
    nullable: true
  })
  comments: CommentEntity[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
