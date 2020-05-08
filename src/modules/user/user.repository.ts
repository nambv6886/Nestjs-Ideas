import { Injectable } from "@nestjs/common";
import { UserModel } from "./models/user.model";
import { UserDto } from "./models/user.dto";
import UserEntity from "./models/user.entity";

@Injectable()
export class UserRepository {

  public async findAll(): Promise<UserModel[]> {
    const entities = await UserEntity.findAll();
    if (entities) {
      return this.toModels(entities);
    }
    return [];
  }

  public async findById(id: number): Promise<UserModel> {
    const userFound = await UserEntity.findOne({ where: { id } });
    if (userFound) {
      return this.toModel(userFound);
    }

    return null;
  }

  public async findByUsername(username: string): Promise<UserModel> {
    const userFound = await UserEntity.findOne({ where: { username } });
    if (userFound) {
      return this.toModel(userFound);
    }
    return null;
  }

  public async create(userModel: UserModel): Promise<UserModel> {
    const newUser = this.toEntity(userModel);
    const result = await newUser.save();

    return this.toModel(result);
  }

  public async update(id: number, userModel: UserModel): Promise<UserModel> {
    const userFound = await UserEntity.findOne({ where: { id } });
    if (userFound) {
      const entity = this.toEntity(userModel, userFound);
      const result = await entity.save();
      return this.toModel(result);
    }

    return null;
  }

  public async delete(id: number): Promise<boolean> {
    const userFound = await UserEntity.findOne({ where: { id } });
    if (userFound) {
      const result = await UserEntity.destroy({ where: { id } });
      if (result) {
        return true;
      }

      return false;
    }
    return false;
  }

  private toModel(entity: UserEntity) {
    return new UserModel({
      id: entity.id,
      username: entity.username,
      password: entity.password,
      salt: entity.salt,
      createdAt: entity.createdAt
    })
  }

  private toModels(entities: UserEntity[]) {
    return entities.map(entity => this.toModel(entity));
  }

  private toEntity(model: UserModel, entity?: UserEntity) {
    if (!entity) {
      entity = new UserEntity();
    }

    entity.id = model.id;
    entity.username = model.username;
    entity.password = model.password;
    entity.salt = model.salt;
    entity.createdAt = model.createdAt;

    return entity;
  }

}
