import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './models/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity])
  ],
  providers: [],
  exports: [TypeOrmModule]
})
export class RoleModule { }
