import { Module, forwardRef, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../../shared/shared.module';
import { JwtStrategy } from './jwt.strategy';
import { UserEntity } from '../user/models/user.entity';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';

@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([UserEntity]),
    SharedModule,
    RefreshTokenModule,
  ],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [AuthService]
})
export class AuthModule { }
