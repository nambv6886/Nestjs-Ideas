import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IdeaRO } from './models/idea.model';
import { IdeaDto } from './models/Idea.dto';
import { UserService } from '../user/user.service';
import { Votes } from '../../common/enum/votes.enum';
import { ResponseMessage, IdeaResponse, UserReponse, JwtPayload } from '../../common/models/responses.model';
import logger from '../../common/utils/logger.util';
import { Idea } from './models/idea.entity';
import { UserRO } from '../user/models/user.model';
import { UserEntity } from '../user/models/user.entity';

@Injectable()
export class IdeaService {
	constructor(
		@InjectRepository(Idea) private ideaRepository: Repository<Idea>,
		private readonly userService: UserService,
		@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
	) { }

	private ideaToReponseObject(idea: Idea): IdeaRO {
		const responseObject: any = {
			...idea,
			author: idea.author ? this.userService.toResponseObject(idea.author) : null
		};

		if (idea.upvotes) {
			responseObject.upvotes = idea.upvotes.length;
		}
		if (idea.downvotes) {
			responseObject.downvotes = idea.downvotes.length;
		}

		return responseObject;
	}

	public async findAll(): Promise<IdeaResponse> {
		const ideas = await this.ideaRepository.find({
			relations: ['author', 'upvotes', 'downvotes', 'comments']
		});

		const ideasRO = ideas.map(idea => this.ideaToReponseObject(idea));
		return new IdeaResponse({
			ideas: ideasRO,
			message: 'get all successfully'
		})
	}

	public async findOneById(id: number): Promise<IdeaResponse> {
		const idea = await this.ideaRepository.findOne({
			where: { id },
			relations: ['author', 'upvotes', 'downvotes', 'comments']
		});

		const ideaRO = this.ideaToReponseObject(idea);
		return new IdeaResponse({
			idea: ideaRO
		})
	}

	public async create(currentUser: JwtPayload, ideaDto: IdeaDto): Promise<IdeaResponse> {
		try {
			const userFound = await this.userRepository.findOne({ where: { id: currentUser.userId } });
			const idea = await this.ideaRepository.create({ ...ideaDto, author: userFound });

			await this.ideaRepository.save(idea);
			const ideaRO = this.ideaToReponseObject(idea);
			return new IdeaResponse({
				idea: ideaRO
			})
		} catch (error) {
			Logger.error(error.message, 'IdeaServiceCreate');
			logger.error(error.message, 'IdeaServiceCreate');
		}
	}

	public async update(id: number, user: JwtPayload, ideaDto: IdeaDto): Promise<IdeaResponse> {
		try {
			const idea = await this.ideaRepository.findOne({
				where: { id },
				relations: ['author', 'upvotes', 'downvotes', 'comments']
			});

			if (!idea) {
				return null;
			}

			const isOwner = this.ensureOwnership(idea, user.userId);
			if (!isOwner) {
				return new IdeaResponse({
					message: 'You are not owner'
				});
			}

			await this.ideaRepository.update({ id }, ideaDto);
			const result = await this.ideaRepository.findOne({
				where: { id },
				relations: ['author', 'upvotes', 'downvotes']
			});

			const ideaRO = this.ideaToReponseObject(result);
			return new IdeaResponse({
				idea: ideaRO
			})
		} catch (err) {
			Logger.error(err.message, 'IdeaServiceUpdate');
			logger.error(err.message, 'IdeaServiceUpdate');
		}
	}

	public async delete(id: number, user: UserRO): Promise<IdeaResponse> {
		const idea = await this.ideaRepository.findOne({
			where: { id },
			relations: ['author']
		});

		if (!idea) {
			return new IdeaResponse({
				message: 'Not found'
			});
		}

		const isOwner = this.ensureOwnership(idea, user.id);
		if (!isOwner) {
			return new IdeaResponse({
				message: 'You are not owner'
			});
		}

		await this.ideaRepository.remove(idea);
		return new IdeaResponse({
			message: 'Delete successfully'
		})
	}

	private ensureOwnership(idea: Idea, userId: number): boolean {
		return !!(idea.author.id === userId);
	}

	public async bookmark(id: number, userModel: JwtPayload): Promise<UserReponse> {
		try {
			const idea = await this.ideaRepository.findOne({ where: { id } });
			const user = await this.userRepository.findOne({
				where: { id: userModel.userId },
				relations: ['bookmarks']
			})

			if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1) {
				user.bookmarks.push(idea);
				const userEntity = await this.userRepository.save(user);
				return new UserReponse({
					user: this.userService.toResponseObject(userEntity),
					message: 'Bookmark successfully'
				});
			} else {
				return new UserReponse({
					message: 'Bookmark fail'
				});
			}
		} catch (error) {
			Logger.error(error.message, 'IdeaServiceBookmark');
			logger.error(error.message, 'IdeaServiceBookmark');
		}
	}

	public async unbookmark(id: number, userModel: JwtPayload): Promise<UserReponse> {
		try {
			const idea = await this.ideaRepository.findOne({ where: { id } });
			const user = await this.userRepository.findOne({
				where: { id: userModel.userId },
				relations: ['bookmarks']
			})

			if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length > 0) {
				user.bookmarks = user.bookmarks.filter(bookmark => bookmark.id !== idea.id)
				const userEntity = await this.userRepository.save(user);
				return new UserReponse({
					user: this.userService.toResponseObject(userEntity),
					message: 'unBookmark successfully'
				});
			} else {
				return new UserReponse({
					message: 'unBookmark fail'
				});
			}
		} catch (error) {
			Logger.error(error.message, 'IdeaServiceUnBookmark');
			logger.error(error.message, 'IdeaServiceUnBookmark');
		}
	}

	public async upvote(id: number, userModel: JwtPayload) {
		const idea = await this.ideaRepository.findOne({
			where: { id },
			relations: ['author', 'upvotes', 'downvotes', 'comment']
		});
		const user = await this.userRepository.findOne({ where: { id: userModel.userId } });
		const ideaResponse = await this.vote(idea, user, Votes.UP);
		if (!idea) {
			return new ResponseMessage({
				message: 'Unable to cast vote'
			})
		}

		return ideaResponse;
	}

	public async downvote(id: number, userModel: JwtPayload) {
		const idea = await this.ideaRepository.findOne({
			where: { id },
			relations: ['author', 'upvotes', 'downvotes', 'comment']
		});
		const user = await this.userRepository.findOne({ where: { id: userModel.userId } });

		const ideaResponse = await this.vote(idea, user, Votes.DOWN);
		if (!idea) {
			return new ResponseMessage({
				message: 'Unable to cast vote'
			})
		}

		return ideaResponse;
	}

	private async vote(idea: Idea, user: UserEntity, vote: Votes): Promise<IdeaResponse> {
		try {
			const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;

			if (
				idea[opposite].filter(voter => voter.id === user.id).length > 0 ||
				idea[vote].filter(voter => voter.id === user.id).length > 0
			) {
				idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
				idea[vote] = idea[vote].filter(voter => voter.id !== user.id);

				const ideaSave = await this.ideaRepository.save(idea);
				return new IdeaResponse({
					idea: this.ideaToReponseObject(ideaSave),
					message: 'vote successfully'
				});
			} else if (
				idea[vote].filter(voter => voter.id === user.id).length < 1
			) {
				idea[vote].push(user);
				const ideaSave = await this.ideaRepository.save(idea);
				return new IdeaResponse({
					idea: this.ideaToReponseObject(ideaSave),
					message: 'vote successfully'
				});
			} else {
				Logger.error('Unable to cast vote', 'IdeaSerivice:Vote');
				logger.error('Unable to cast vote', 'IdeaSerivice:Vote');
				return new IdeaResponse({
					message: 'Vote fail'
				});;
			}
		} catch (err) {
			console.log(err.message);
		}
	}
}

