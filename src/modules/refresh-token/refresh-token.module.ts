import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './models/refreshToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  providers: [RefreshTokenService],
  exports: [TypeOrmModule, RefreshTokenService]
})
export class RefreshTokenModule { }
