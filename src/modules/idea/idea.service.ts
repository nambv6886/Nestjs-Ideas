import { Injectable } from '@nestjs/common';
import { IdeaRepository } from './idea.repository';
import { IdeaModel } from './idea.model';
import { IdeaDto } from './idea.dto';
import { UserService } from '../user/user.service';
import { UserModel } from '../user/models/user.model';

@Injectable()
export class IdeaService {
	constructor(
		private readonly ideaRepository: IdeaRepository,
		private readonly userService: UserService
	) { }

	public async findAll() {
		return await this.ideaRepository.findAll();
	}

	public async findOneById(id: number) {
		return await this.ideaRepository.findById(id);
	}

	public async create(userModel: UserModel, ideaDto: IdeaDto) {
		const ideaModel = new IdeaModel({
			idea: ideaDto.idea,
			descripion: ideaDto.description,
			userId: userModel.id
		});

		return await this.ideaRepository.create(ideaModel);
	}

	public async update(id: number, ideaModel: IdeaDto, user: UserModel): Promise<IdeaModel> {
		const ideaFound = await this.ideaRepository.findById(id);
		if (!ideaFound) {
			return null;
		}

		if (!this.ensureOwnership(ideaFound, user.id)) {
			return null;
		}

		const newIdea = new IdeaModel({
			idea: ideaModel.idea,
			descripion: ideaModel.description
		});
		return await this.ideaRepository.update(id, newIdea);

	}

	public async delete(id: number, user: UserModel) {
		return await this.ideaRepository.delete(id);
	}

	private ensureOwnership(idea: IdeaModel, userId: number): boolean {
		return !!(idea.userId === userId);
	}
}
