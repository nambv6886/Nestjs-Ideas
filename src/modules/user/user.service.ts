import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRO } from './models/user.model';
import { UserDto } from './models/user.dto';
import { ResponseMessage, UserReponse } from '../../common/models/responses.model';
import { UserEntity } from './models/user.entity';
import logger from '../../common/utils/logger.util';
import { RoleEntity } from '../role/models/role.entity';
import { RoleType } from 'src/common/enum/roles.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private roleRepository: Repository<RoleEntity>
  ) { }

  public toResponseObject(entity: UserEntity): UserRO {
    const responseObject = new UserRO({
      id: entity.id,
      createdAt: entity.createdAt,
      username: entity.username
    });

    if (entity.ideas) {
      responseObject.ideas = entity.ideas;
    }

    if (entity.bookmarks) {
      responseObject.bookmarks = entity.bookmarks;
    }

    return responseObject;
  }

  public async findAll(pageIndex = 1, pageSize = 5): Promise<UserReponse> {
    const users = await this.userRepository.find({
      relations: ['ideas', 'bookmarks'],
      take: pageSize,
      skip: pageSize * (pageIndex - 1)
    });

    const userResponse = users.map(user => this.toResponseObject(user));

    return new UserReponse({
      users: userResponse
    })
  }

  public async findById(id: number): Promise<UserReponse> {
    const userFound = await this.userRepository.findOne({ where: { id } });
    return new UserReponse({
      user: this.toResponseObject(userFound)
    })
  }

  public async findByUsername(username: string): Promise<UserRO> {
    const user = await this.userRepository.findOne({ where: { username } });
    return this.toResponseObject(user);
  }

  public async create(userDto: UserDto): Promise<UserReponse> {
    try {
      const userFound = await this.userRepository.findOne({ where: { username: userDto.username } });

      if (userFound) {
        return new UserReponse({
          message: 'Username is already exist'
        });
      }

      const roleUser = await this.roleRepository.findOne({
        where: { name: RoleType.USER }
      });

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(userDto.password, salt);

      const data = {
        username: userDto.username,
        salt,
        password: hashPassword,
      };

      const user = await this.userRepository.create({ ...data, roles: [roleUser] });
      const result = await this.userRepository.save(user);
      if (!result) {
        return new UserReponse({
          message: 'Create user is fail'
        });;
      }

      return new UserReponse({
        user: this.toResponseObject(result),
        message: 'Create user successfully'
      });;

    } catch (error) {
      Logger.error(error.message, 'UserServiceCreate');
      logger.error(error.message, 'UserServiceCreate');
      return new UserReponse({
        message: 'Common error'
      });;
    }
  }

  public async update(id: number, userDto: UserDto): Promise<UserReponse> {
    try {
      const userFound = await this.userRepository.findOne({ where: { id } });
      if (!userFound) {
        return new UserReponse({
          message: 'User not found'
        })
      }
      let newSalt, newHashPassword;

      if (userDto.password) {
        newSalt = await bcrypt.genSalt();
        newHashPassword = await bcrypt.hash(userDto.password, newSalt);
      }

      const data = {
        username: userDto.username,
        salt: newSalt,
        hashPassword: newHashPassword
      };
      const user = await this.userRepository.save(data);
      return new UserReponse({
        user: this.toResponseObject(user),
        message: 'Update user successfully'
      })
    } catch (error) {
      Logger.error(error.message, 'UserServiceUpdate');
      logger.error(error.message, 'UserServiceUpdate');
      return new UserReponse({
        message: 'Common error'
      });;
    }
  }

  public async delete(id): Promise<UserReponse> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        return new UserReponse({
          message: 'User not found'
        })
      }
      await this.userRepository.remove(user);
      return new UserReponse({
        message: 'Delete successfully'
      })
    } catch (error) {
      Logger.error(error.message, 'UserServiceDelete');
      logger.error(error.message, 'UserServiceDelete');
      return new UserReponse({
        message: 'Common error'
      });;
    }
  }

  public async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
