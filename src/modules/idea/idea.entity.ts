import { Table, Model, Unique, AutoIncrement, Column } from "sequelize-typescript";
import { CreateDateColumn } from "typeorm";

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


}