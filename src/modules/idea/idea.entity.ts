import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne, ManyToMany, JoinTable, Entity } from "typeorm";
import { UserEntity } from "../user/user.entity";

@Entity('idea')
export class Idea {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text')
  idea: string;

  @Column('text')
  description: string;

  @ManyToOne(type => UserEntity, author => author.ideas)
  author: UserEntity;

  @ManyToMany(type => UserEntity)
  @JoinTable()
  upvotes: UserEntity[];

  @ManyToMany(type => UserEntity)
  @JoinTable()
  downvotes: UserEntity[];

}