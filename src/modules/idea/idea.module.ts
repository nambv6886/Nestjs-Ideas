import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { UserModule } from '../user/user.module';
import { Idea } from './idea.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Idea])],
  controllers: [IdeaController],
  providers: [IdeaService],
  exports: [IdeaService, TypeOrmModule]
})
export class IdeaModule { }
