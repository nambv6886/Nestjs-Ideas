import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Idea } from "../../idea/models/idea.entity";
import { UserRO } from "./user.model";
import { RoleEntity } from "src/modules/role/models/role.entity";

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

  @ManyToMany(type => RoleEntity)
  @JoinTable()
  roles: RoleEntity[];

  toResponseObject(): UserRO {
    const { id, createdAt, username } = this;
    const responseObject = new UserRO({
      id,
      createdAt,
      username
    });

    if (this.ideas) {
      responseObject.ideas = this.ideas;
    }

    if (this.bookmarks) {
      responseObject.bookmarks = this.bookmarks;
    }

    return responseObject;
  }

}