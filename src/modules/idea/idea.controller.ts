import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';

import { IdeaService } from './idea.service';
import { IdeaDto } from './models/Idea.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../user/current-user.decorator';
import { IdeaResponse, JwtPayload } from '../../common/models/responses.model';
import { UserRO } from '../user/models/user.model';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleType } from 'src/common/enum/roles.enum';

@Controller('idea')
export class IdeaController {

  constructor(
    private ideaService: IdeaService
  ) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  showAllIdeas(@CurrentUser() user: JwtPayload, @Query('page') page: number, @Query('pageSize') pageSize: number): Promise<IdeaResponse> {
    return this.ideaService.findAll(page, pageSize);
  }

  @Get('newest')
  showNewestIdea(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    return this.ideaService.findAll(page, pageSize, true);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(RoleType.USER)
  createIdea(@CurrentUser() user: JwtPayload, @Body() idea: IdeaDto): Promise<IdeaResponse> {
    return this.ideaService.create(user, idea);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  readIdea(@Param('id') id: number): Promise<IdeaResponse> {
    return this.ideaService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateIdea(@CurrentUser() user: JwtPayload, @Param('id') id: number, @Body() ideaModel: IdeaDto): Promise<IdeaResponse> {
    return this.ideaService.update(id, user, ideaModel);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteIdea(@Param('id') id: number, @CurrentUser() user: UserRO) {
    return this.ideaService.delete(id, user);
  }

  @Post(':id/bookmark')
  @UseGuards(JwtAuthGuard)
  bookmarkIdea(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    return this.ideaService.bookmark(id, user);
  }

  @Delete(':id/unbookmark')
  @UseGuards(JwtAuthGuard)
  unbookmarkIdea(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    return this.ideaService.unbookmark(id, user);
  }

  @Post(':id/upvote')
  @UseGuards(JwtAuthGuard)
  upvoteIdea(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    return this.ideaService.upvote(id, user);
  };

  @Post(':id/downvote')
  @UseGuards(JwtAuthGuard)
  downvoteIdea(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    return this.ideaService.downvote(id, user);
  };

}
