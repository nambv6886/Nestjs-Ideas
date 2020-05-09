import { Table, Unique, AutoIncrement, Column, CreatedAt, IsEmail, Model, HasMany } from "sequelize-typescript";
import { CreateDateColumn } from "typeorm";
import Idea from "../../idea/idea.entity";

@Table({ tableName: 'user' })
export default class UserEntity extends Model<UserEntity> {
  @Unique
  @AutoIncrement
  @Column({ primaryKey: true })
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Unique
  @IsEmail
  @Column
  username: string;

  @Column
  password: string;

  @Column
  salt: string;

  @HasMany(() => Idea)
  ideas: Idea[];

}