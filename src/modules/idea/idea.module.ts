import { Module } from '@nestjs/common';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { IdeaRepository } from './idea.repository';

@Module({
  imports: [],
  controllers: [IdeaController],
  providers: [IdeaService, IdeaRepository],
  exports: [IdeaService]
})
export class IdeaModule { }
