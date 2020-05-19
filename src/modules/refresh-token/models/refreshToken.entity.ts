import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  refreshToken: string;

  @Column()
  userId: number;
}