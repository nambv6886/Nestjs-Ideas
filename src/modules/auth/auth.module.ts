import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../../shared/shared.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    SharedModule],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [AuthService]
})
export class AuthModule { }
