import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../modules/auth/auth.service';
import logger from '../utils/logger.util';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(AuthService) private authService: AuthService
  ) {
    super(AuthService)
  }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    try {
      const request = context.switchToHttp().getRequest();
      const isDeativate = this.authService.isTokenDeactivate(request.headers.authorization);
      if (isDeativate) {
        return false;
      }

      return super.canActivate(context);
    } catch (error) {
      Logger.error(`[Jwt-auth][Guard]: ${JSON.stringify(error.message)}`);
      return false;
    }
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      logger.error(`[Guard][Jwt-Auth]: ${JSON.stringify(err)}`);
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
