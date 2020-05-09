import { Module } from '@nestjs/common';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { IdeaRepository } from './idea.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [IdeaController],
  providers: [IdeaService, IdeaRepository],
  exports: [IdeaService]
})
export class IdeaModule { }
