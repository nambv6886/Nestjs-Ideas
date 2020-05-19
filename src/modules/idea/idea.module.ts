import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { UserModule } from '../user/user.module';
import { Idea } from './models/idea.entity';
import { UserEntity } from '../user/models/user.entity';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Idea]), SharedModule],
  controllers: [IdeaController],
  providers: [IdeaService],
  exports: [IdeaService, TypeOrmModule]
})
export class IdeaModule { }
