import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import { JwtPayload, ResponseMessage, RefreshTokenRespose, RefreshTokenPayload } from '../../common/models/responses.model';
import { RefreshTokenModel } from './models/refreshToken.model';
import logger from '../../common/utils/logger.util';
import { CommonUtils } from '../../common/utils/common.util';
import { RefreshToken } from './models/refreshToken.entity';
import { REFRESH_TOKEN_JWT_KEY, REFRESH_TOKEN_JWT_EXPIRES } from 'src/config/environment';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken) private refreshTokenRepository: Repository<RefreshToken>
  ) { }

  public async create(refreshTokenModel: RefreshTokenModel) {
    try {
      return await this.refreshTokenRepository.save(refreshTokenModel);
    } catch (error) {
      Logger.error(error.message, null, 'RefreshTokenService');
      logger.error(`[RefreshTokenService:create]: ${error.message}`);
      return new ResponseMessage({
        message: 'Common Error'
      });
    }
  }

  public async delete(userId: number, key: string) {
    try {
      return await this.refreshTokenRepository.delete({
        userId,
        key
      });
    } catch (error) {
      Logger.error(error.message, null, 'RefreshTokenService');
      logger.error(`[RefreshTokenService:create]: ${error.message}`);
      return new ResponseMessage({
        message: 'Common Error'
      });
    }
  }

  public async findByUserIdAndKey(userId: number, key: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne({
      where: {
        userId,
        key
      }
    })
  }

  public async generateRefreshToken(userId: number): Promise<string> {
    try {
      if (CommonUtils.isNullorUndefined(userId)) {
        return null;
      }

      const key = await bcrypt.genSalt();

      const refreshTokenPayload: RefreshTokenPayload = {
        key,
        userId
      };

      const token = jwt.sign(refreshTokenPayload, REFRESH_TOKEN_JWT_KEY, { expiresIn: REFRESH_TOKEN_JWT_EXPIRES });

      const refreshTokenModel = this.refreshTokenRepository.create({
        userId,
        refreshToken: token,
        key
      });

      await this.create(refreshTokenModel);

      return token;
    } catch (error) {
      Logger.error(error.message, null, 'RefreshTokenService');
      logger.error(`[RefreshTokenService]: ${error.message}`);
      return null;
    }
  }
}
