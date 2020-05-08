import { Injectable } from '@nestjs/common';
import { IdeaRepository } from './idea.repository';
import { IdeaModel } from './idea.model';
import { IdeaDto } from './idea.dto';

@Injectable()
export class IdeaService {
	constructor(
		private readonly ideaRepository: IdeaRepository
	) { }

	public async findAll() {
		return await this.ideaRepository.findAll();
	}

	public async findOneById(id: number) {
		return await this.ideaRepository.findById(id);
	}

	public async create(ideaDto: IdeaDto) {
		const ideaModel = new IdeaModel({
			idea: ideaDto.idea,
			descripion: ideaDto.description
		})
		return await this.ideaRepository.create(ideaModel);
	}

	public async update(id: number, ideaModel: IdeaDto) {
		const ideaFound = await this.ideaRepository.findById(id);
		if (ideaFound) {
			const newIdea = new IdeaModel({
				idea: ideaModel.idea,
				descripion: ideaModel.description
			})
			return await this.ideaRepository.update(id, newIdea);
		}
		return null;
	}

	public async delete(id: number) {
		return await this.ideaRepository.delete(id);
	}
}
