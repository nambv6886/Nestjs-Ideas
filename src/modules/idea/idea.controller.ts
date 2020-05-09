import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../user/current-user.decorator';
import { UserModel } from '../user/models/user.model';
import { IdeaModel } from './idea.model';

@Controller('idea')
export class IdeaController {

  constructor(
    private ideaService: IdeaService
  ) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  showAllIdeas(@CurrentUser() user): Promise<IdeaModel[]> {
    return this.ideaService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createIdea(@CurrentUser() user: UserModel, @Body() idea: IdeaDto): Promise<IdeaModel> {
    return this.ideaService.create(user, idea);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  readIdea(@Param('id') id: number): Promise<IdeaModel> {
    return this.ideaService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateIdea(@CurrentUser() user: UserModel, @Param('id') id: number, @Body() ideaModel: IdeaDto): Promise<IdeaModel> {
    return this.ideaService.update(id, ideaModel, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteIdea(@Param('id') id: number, @CurrentUser() user: UserModel) {
    return this.ideaService.delete(id, user);
  }
}
