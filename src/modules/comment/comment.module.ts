import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { UserModule } from '../user/user.module';
import { IdeaModule } from '../idea/idea.module';
import { CommentEntity } from './models/comment.entity';

@Module({
  imports: [
    UserModule,
    IdeaModule,
    TypeOrmModule.forFeature([CommentEntity])
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [TypeOrmModule]
})
export class CommentModule { }
