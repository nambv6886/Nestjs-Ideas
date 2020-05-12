import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Idea } from "../idea/idea.entity";

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @Column('text')
  salt: string;

  @OneToMany(type => Idea, idea => idea.author)
  ideas: Idea[];

  @ManyToMany(type => Idea)
  @JoinTable()
  bookmarks: Idea[];

}