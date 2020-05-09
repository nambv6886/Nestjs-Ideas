import { Injectable } from "@nestjs/common";

import Idea from "./idea.entity";
import { IdeaModel } from "./idea.model";
import UserEntity from "../user/models/user.entity";
import logger from "../../common/utils/logger.util";

@Injectable()
export class IdeaRepository {

  public async create(idea: IdeaModel): Promise<IdeaModel> {
    const newIdea = this.toEntity(idea);
    const result = await newIdea.save();

    return this.toModel(result);
  }

  public async findAll(): Promise<IdeaModel[]> {
    try {
      const ideaEntitys = await Idea.findAll({ include: [UserEntity] });

      if (ideaEntitys) {
        return this.toModels(ideaEntitys);
      }

    } catch (err) {
      logger.error(err, 'Idea repo');

      return [];
    }
  }

  public async findById(id: number): Promise<IdeaModel> {
    const idea = await Idea.findOne({ where: { id } });

    if (idea) {
      const result = this.toModel(idea);
      return result;
    }

    return null;
  }

  public async update(id: number, ideaModel: IdeaModel): Promise<IdeaModel> {
    const ideaFound = await Idea.findOne({ where: { id } });

    if (ideaFound) {
      const entity = this.toEntity(ideaModel, ideaFound);
      const result = await entity.save();

      return this.toModel(result);
    }

    return null;
  }

  public async delete(id: number) {
    const ideaFound = await Idea.findOne({ where: { id } });

    if (ideaFound) {
      const result = await Idea.destroy({ where: { id } });
      return result;
    }

    return null;
  }

  private toModel(entity: Idea) {
    return new IdeaModel({
      id: entity.id,
      idea: entity.idea,
      descripion: entity.description,
      createdAt: entity.createdAt,
      userId: entity.userId
    })
  }

  private toModels(entitys: Idea[]) {
    return entitys.map(entity => this.toModel(entity));
  }

  private toEntity(model: IdeaModel, entity?: Idea) {
    if (!entity) {
      entity = new Idea();
    }

    entity.id = model.id;
    entity.idea = model.idea;
    entity.description = model.descripion;
    entity.createdAt = model.createdAt;
    entity.userId = model.userId

    return entity;
  }
}