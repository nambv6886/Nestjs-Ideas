import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity } from './models/comment.entity';
import { Idea } from '../idea/models/idea.entity';
import { UserEntity } from '../user/models/user.entity';
import { CommentDTO } from './models/comment.dto';
import { JwtPayload, IdeaResponse, ResponseMessage, CommentResponseMessage } from 'src/common/models/responses.model';
import logger from 'src/common/utils/logger.util';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>,
    @InjectRepository(Idea) private ideaRepository: Repository<Idea>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) { }

  public async show(id: number): Promise<CommentResponseMessage> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id },
        relations: ['author', 'idea']
      });

      return new CommentResponseMessage({
        message: 'Get One Success',
        comment: this.toResponseObject(comment)
      });
    } catch (error) {
      Logger.error(error.message, 'CommentService:Show');
      logger.error(error.message, 'CommentService:Show');
      return new CommentResponseMessage({
        message: 'Common Error'
      });
    }
  }

  public async create(ideaId: number, currentUser: JwtPayload, data: CommentDTO): Promise<CommentResponseMessage> {
    try {
      const ideaFound = await this.ideaRepository.findOne({
        where: { id: ideaId }
      })
      const user = await this.userRepository.findOne({
        where: { id: currentUser.userId }
      });

      const comment = await this.commentRepository.create({
        ...data,
        author: user,
        idea: ideaFound
      });
      await this.commentRepository.save(comment);
      return new CommentResponseMessage({
        comment: this.toResponseObject(comment),
        message: 'Create success'
      })
    } catch (error) {
      Logger.error(error.message, 'CommentService:Create');
      logger.error(error.message, 'CommentService:Create');
      return new CommentResponseMessage({
        message: 'Common Error'
      });;
    }
  }

  public async delete(id: number, currentUser: JwtPayload): Promise<CommentResponseMessage> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id },
        relations: ['author', 'idea']
      });

      if (comment.author.id !== currentUser.userId) {
        return new CommentResponseMessage({
          message: 'You do not own this comment'
        })
      }

      await this.commentRepository.remove(comment);
      return new CommentResponseMessage({
        message: 'delete success'
      })
    } catch (error) {
      Logger.error(error.message, 'CommentService:Delete');
      logger.error(error.message, 'CommentService:Delete');
      return new CommentResponseMessage({
        message: 'Common Error'
      });
    }
  }

  public async showByIdeaId(id: number, pageIndex = 1, pageSize = 5): Promise<CommentResponseMessage> {
    try {
      const comments = await this.commentRepository.find({
        where: { idea: { id } },
        relations: ['comments', 'comments.author', 'comments.idea'],
        take: pageSize,
        skip: pageSize * (pageIndex - 1)
      });

      return new CommentResponseMessage({
        comments: comments.map(comment => this.toResponseObject(comment))
      })
    } catch (error) {
      Logger.error(error.message, 'CommentService:ShowByIdeaID');
      logger.error(error.message, 'CommentService:ShowByIdeaID');
      return new CommentResponseMessage({
        message: 'Common Error'
      });
    }
  }

  public async showByUserId(id: number, pageIndex = 1, pageSize = 5) {
    const comments = await this.commentRepository.find({
      where: { author: { id } },
      relations: ['author'],
      take: pageSize,
      skip: pageSize * (pageIndex - 1)
    });

    return comments.map(comment => this.toResponseObject(comment));
  }

  private toResponseObject(comment: CommentEntity) {
    const responseObject: any = comment;
    if (responseObject.author) {
      responseObject.author = comment.author.toResponseObject();
    }
    return responseObject;
  }
}
