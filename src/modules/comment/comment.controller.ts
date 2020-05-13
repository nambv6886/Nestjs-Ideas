import { Controller, Get, Param, UseGuards, Post, Body, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../user/current-user.decorator';
import { JwtPayload } from '../../common/models/responses.model';
import { CommentDTO } from './models/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(
    private commentService: CommentService
  ) { }

  @Get("idea/:id")
  showCommentByIdeaId(@Param('id') ideaId: number) {
    return this.commentService.showByIdeaId(ideaId);
  }

  @Get('user/:id')
  showCommentByUserID(@Param('id') userId: number) {
    return this.commentService.showByUserId(userId);
  }

  @Post('idea/:id')
  @UseGuards(JwtAuthGuard)
  createComment(@Param('id') ideaId: number, @CurrentUser() user: JwtPayload, @Body() data: CommentDTO) {
    return this.commentService.create(ideaId, user, data);
  }

  @Get(':id')
  showComment(@Param('id') id: number) {
    return this.commentService.show(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteComment(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    return this.commentService.delete(id, user);
  }

}
