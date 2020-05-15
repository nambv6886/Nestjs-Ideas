import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { UserService } from '../user/user.service';
import { CacheService } from '../../shared/cache/cache.service';
import { UserDto } from '../user/models/user.dto';
import { LoginResponse, JwtPayload, ResponseMessage } from '../../common/models/responses.model';
import { JWT_SECRET_KEY } from '../../config/environment';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/models/user.entity';
import logger from '../../common/utils/logger.util';
import { RoleEntity } from '../role/models/role.entity';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly cacheService: CacheService,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) { }

  public async doLogin(userDto: UserDto): Promise<LoginResponse> {
    try {
      const user = await this.userRepository.findOne({ where: { username: userDto.username }, relations: ['roles'] })
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

      const roles = [];
      for (const role of user.roles) {
        console.log('roleName:', role.name);
        roles.push(role.name);
      }

      const jwtPayload: JwtPayload = {
        userId: user.id,
        username: user.username,
        roles
      };

      // expired in 1h
      const accessToken = await jwt.sign(jwtPayload, JWT_SECRET_KEY, { expiresIn: 6400 * 1000 })

      return new LoginResponse({
        message: 'Login successfully',
        accessToken
      });
    } catch (err) {
      Logger.error(err.message, 'AuthService');
      logger.error(err.message, 'AuthService');
      return new LoginResponse({
        message: 'Common Erros'
      })
    }
  }

}
