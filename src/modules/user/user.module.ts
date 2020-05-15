import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from './models/user.entity';
import { Idea } from '../idea/models/idea.entity';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity]),
    RoleModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule]
})
export class UserModule { }
