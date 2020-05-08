import { Injectable } from '@nestjs/common';
import { UserModel } from './models/user.model';
import { UserDto } from './models/user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { ResponseMessage } from '../../common/models/responses.model';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository
  ) { }

  public async findAll(): Promise<UserModel[]> {
    return await this.userRepository.findAll();
  }

  public async findById(id: number): Promise<UserModel> {
    return await this.userRepository.findById(id);
  }

  public async findByUsername(username: string): Promise<UserModel> {
    return await this.userRepository.findByUsername(username);
  }

  public async create(userDto: UserDto): Promise<ResponseMessage> {
    try {
      const userFound = await this.userRepository.findByUsername(userDto.username);
      if (userFound) {
        return new ResponseMessage({
          message: 'Username is already exist'
        });
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(userDto.password, salt);

      const newUser = new UserModel({
        username: userDto.username,
        password: hashPassword,
        salt
      });

      const result = await this.userRepository.create(newUser);
      if (!result) {
        return new ResponseMessage({
          message: 'Create user is fail'
        });;
      }

      return new ResponseMessage({
        message: 'Create user successfully'
      });;

    } catch (err) {
      return new ResponseMessage({
        message: 'Common error'
      });;
    }
  }

  public async update(id: number, userDto: UserDto): Promise<UserModel> {
    let newSalt, hashPassword;

    if (userDto.password) {
      newSalt = await bcrypt.genSalt();
      hashPassword = await bcrypt.hash(userDto.password, newSalt);
    }

    const userModel = new UserModel({
      username: userDto.username,
      password: hashPassword,
      salt: newSalt
    })
    return await this.userRepository.update(id, userModel);
  }

  public async delete(id): Promise<boolean> {
    return await this.userRepository.delete(id);
  }

  public async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
