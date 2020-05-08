import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto';

@Controller('idea')
export class IdeaController {

  constructor(
    private ideaService: IdeaService
  ) { }

  @Get()
  showAllIdeas() {
    return this.ideaService.findAll();
  }

  @Post()
  createIdea(@Body() idea: IdeaDto) {
    return this.ideaService.create(idea);
  }

  @Get(':id')
  readIdea(@Param('id') id: number) {
    return this.ideaService.findOneById(id);
  }

  @Put(':id')
  updateIdea(@Param('id') id: number, @Body() ideaModel: IdeaDto) {
    return this.ideaService.update(id, ideaModel);
  }

  @Delete(':id')
  deleteIdea(@Param('id') id: number) {
    return this.ideaService.delete(id);
  }
}
