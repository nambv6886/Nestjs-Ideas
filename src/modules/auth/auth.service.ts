import { Injectable, Logger, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { UserService } from '../user/user.service';
import { CacheService } from '../../shared/cache/cache.service';
import { UserDto } from '../user/models/user.dto';
import { LoginResponse, JwtPayload, ResponseMessage, RefreshTokenPayload } from '../../common/models/responses.model';
import { JWT_SECRET_KEY, REFRESH_TOKEN_JWT_KEY } from '../../config/environment';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/models/user.entity';
import logger from '../../common/utils/logger.util';
import { RoleEntity } from '../role/models/role.entity';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { RefreshTokenModel } from '../refresh-token/models/refreshToken.model';
import { CommonUtils } from 'src/common/utils/common.util';
import { RefreshTokenDto } from '../refresh-token/models/refreshToken.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(CacheService) private readonly cacheService: CacheService,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private refreshTokenService: RefreshTokenService
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
        roles.push(role.name);
      }

      const jwtPayload: JwtPayload = {
        userId: user.id,
        username: user.username,
        roles
      };

      // expired in 1h
      const accessToken = await jwt.sign(jwtPayload, JWT_SECRET_KEY, { expiresIn: 6400 * 1000 });
      // expired in 1 day
      const refreshToken = await this.refreshTokenService.generateRefreshToken(user.id);

      return new LoginResponse({
        message: 'Login successfully',
        accessToken,
        refreshToken
      });
    } catch (err) {
      Logger.error(err.message, 'AuthService');
      logger.error(err.message, 'AuthService');
      return new LoginResponse({
        message: 'Common Erros'
      })
    }
  }

  public async doLogout(currentUser: JwtPayload, accessToken: string, refreshToken: string): Promise<ResponseMessage> {
    try {
      const refreshTokenPayload = this.parseRefreshToken(refreshToken);
      if (CommonUtils.isNullorUndefined(refreshTokenPayload.userId) || CommonUtils.isNullorUndefined(refreshTokenPayload.key
        || refreshTokenPayload.userId !== currentUser.userId)) {
        return new ResponseMessage({
          message: 'Logout fail'
        });
      }

      const refreshTokenFound = await this.refreshTokenService.findByUserIdAndKey(refreshTokenPayload.userId, refreshTokenPayload.key);
      if (!refreshTokenFound) {
        return new ResponseMessage({
          message: 'Logout fail'
        });
      }

      // delete refreshToken in db
      await this.refreshTokenService.delete(refreshTokenFound.userId, refreshTokenFound.key);
      // deactive accessToken
      this.deactiveAccessToken(accessToken);
      return new ResponseMessage({
        message: 'Logout success'
      })
    } catch (error) {
      logger.error(`[AuthService:Logout]: ${JSON.stringify(error.message)}`);
      return new ResponseMessage({
        message: 'Common Error'
      })
    }
  }

  public async doRefreshToken(currentUser: JwtPayload, refreshTokenRequest: RefreshTokenDto): Promise<LoginResponse> {
    const validToken = jwt.verify(refreshTokenRequest.refreshToken, REFRESH_TOKEN_JWT_KEY);
    if (!validToken) {
      return new LoginResponse({
        message: 'Refresh token invalid'
      })
    };

    const refreshTokenPayload = this.parseRefreshToken(refreshTokenRequest.refreshToken);
    if (CommonUtils.isNullorUndefined(refreshTokenPayload.userId) || CommonUtils.isNullorUndefined(refreshTokenPayload.key
      || refreshTokenPayload.userId !== currentUser.userId)) {
      return new LoginResponse({
        message: 'Refresh token invalid'
      });
    }

    const refreshTokenFound = await this.refreshTokenService.findByUserIdAndKey(refreshTokenPayload.userId, refreshTokenPayload.key);
    if (!refreshTokenFound) {
      return new LoginResponse({
        message: 'Refresh token invalid'
      });
    }

    const user = await this.userRepository.findOne({
      where: { id: refreshTokenPayload.userId },
      relations: ['roles']
    });
    if (!user) {
      return new LoginResponse({
        message: 'Refresh token invalid'
      });
    }

    const roles = [];
    for (const role of user.roles) {
      roles.push(role.name);
    }

    const jwtPayload: JwtPayload = {
      userId: user.id,
      username: user.username,
      roles
    };

    // expired in 1h
    const accessToken = await jwt.sign(jwtPayload, JWT_SECRET_KEY, { expiresIn: 6400 * 1000 });

    return new LoginResponse({
      message: 'Refresh Login successfully',
      accessToken,
      refreshToken: refreshTokenRequest.refreshToken
    });
  }

  public parseRefreshToken(token: string): RefreshTokenPayload {
    const decode = jwt.decode(token);
    const userId = decode['userId'];
    const key = decode['key'];
    return new RefreshTokenPayload({
      userId,
      key
    })
  }

  public deactiveAccessToken(token: string): void {
    token = token.substring(7).trim();
    this.cacheService.set(token, token, 3600 * 1000);
  }

  public isTokenDeactivate(token: string): boolean {
    try {
      token = token.substring(7).trim();
      const tokenInCache = this.cacheService.get<string>(token);
      const isVerify = jwt.verify(token, JWT_SECRET_KEY);
      if (tokenInCache || !isVerify) {
        return true;
      }
      return false;
    } catch (error) {
      Logger.error(`[AuthService]: ${JSON.stringify(error.message)}`);
      return true;
    }
  }

}
