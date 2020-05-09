import { Table, Model, Unique, AutoIncrement, Column, BelongsTo, ForeignKey } from "sequelize-typescript";
import { CreateDateColumn } from "typeorm";

import UserEntity from "../user/models/user.entity";

@Table({ tableName: 'idea' })
export default class Idea extends Model<Idea> {
  @Unique
  @AutoIncrement
  @Column({ primaryKey: true })
  id: number;

  @Column
  idea: string;

  @Column
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @BelongsTo(() => UserEntity)
  user: UserEntity;

  @ForeignKey(() => UserEntity)
  @Column({ field: 'user_id' })
  userId: number;
}