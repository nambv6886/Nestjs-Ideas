import { Table, Unique, AutoIncrement, Column, CreatedAt, IsEmail, Model } from "sequelize-typescript";
import { CreateDateColumn } from "typeorm";

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

}