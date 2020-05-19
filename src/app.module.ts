import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaModule } from './modules/idea/idea.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { Connection } from 'typeorm';
import { CommentModule } from './modules/comment/comment.module';
import { RoleModule } from './modules/role/role.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';

@Module({
  imports: [
    IdeaModule,
    UserModule,
    AuthModule,
    SharedModule,
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'test',
      entities: ['src/modules/**/**/*.entity.ts, dist/modules/**/**/*.entity.js'],
      synchronize: true,
      // dropSchema: true
    }),
    CommentModule,
    RoleModule,
    RefreshTokenModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) { }
}
