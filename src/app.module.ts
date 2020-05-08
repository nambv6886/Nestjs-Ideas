import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './config/db.config.module';
import { IdeaModule } from './modules/idea/idea.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    DatabaseModule,
    IdeaModule,
    UserModule,
    AuthModule,
    SharedModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
