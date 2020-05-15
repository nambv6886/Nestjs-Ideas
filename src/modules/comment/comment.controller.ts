import { Controller, Get, Param, UseGuards, Post, Body, Delete, Query } from '@nestjs/common';
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
  showCommentByIdeaId(@Param('id') ideaId: number, @Query('pageIndex') pageIndex: number, @Query('pageSize') pageSize: number) {
    return this.commentService.showByIdeaId(ideaId, pageIndex, pageSize);
  }

  @Get('user/:id')
  showCommentByUserID(@Param('id') userId: number, @Query('pageIndex') pageIndex: number, @Query('pageSize') pageSize: number) {
    return this.commentService.showByUserId(userId, pageIndex, pageSize);
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
