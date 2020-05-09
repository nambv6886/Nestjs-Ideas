import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_SECRET_KEY } from 'src/config/environment';
import { UserService } from '../user/user.service';
import { JwtPayload } from '../../common/models/responses.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET_KEY,
    });
  }

  async validate(payload: JwtPayload) {

    const user = await this.userService.findByUsername(payload.username);
    if (!user) {
      return new UnauthorizedException();
    }
    return user;
  }
}