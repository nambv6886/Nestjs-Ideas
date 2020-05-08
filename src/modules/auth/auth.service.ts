import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { UserService } from '../user/user.service';
import { CacheService } from '../../shared/cache/cache.service';
import { UserDto } from '../user/models/user.dto';
import { LoginResponse, JwtPayload, ResponseMessage } from '../../common/models/responses.model';
import { JWT_SECRET_KEY } from '../../config/environment';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly cacheService: CacheService
  ) { }

  public async doLogin(userDto: UserDto): Promise<LoginResponse> {
    try {
      const user = await this.userService.findByUsername(userDto.username);
      if (!user) {
        return new LoginResponse({
          message: 'Email is wrong'
        })
      }

      const hashPassword = await this.userService.hashPassword(userDto.password, user.salt);

      // !! convert to boolean
      const isMatch = !!(user.password === hashPassword);

      if (!isMatch) {
        return new LoginResponse({
          message: 'Password is wrong'
        })
      }

      const jwtPayload: JwtPayload = {
        userId: user.id,
        username: user.username
      };

      // expired in 1h
      const accessToken = await jwt.sign(jwtPayload, JWT_SECRET_KEY, { expiresIn: 6400 * 1000 })

      return new LoginResponse({
        message: 'Login successfully',
        accessToken
      });
    } catch (err) {
      return new LoginResponse({
        message: 'Common Erros'
      })
    }
  }

}
