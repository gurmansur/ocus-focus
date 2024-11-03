import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CreateUserStoryDto } from './dto/create-user-story.dto';
import { UpdateUserStoryDto } from './dto/update-user-story.dto';
import { UserStory } from './entities/user-story.entity';

@Injectable()
export class UserStoryService {
  constructor(
    @InjectRepository(UserStory)
    private readonly userStoryRepository: Repository<UserStory>,
  ) {}
  async findAll(projetoId: Projeto) {
    if (!projetoId)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    const userStories = await this.userStoryRepository.find({
      where: { projeto: { id: projetoId.id } },
      relations: ['swimlane'],
    });

    const response = userStories.map((userStory) => {
      return {
        id: userStory.id,
        titulo: userStory.titulo,
        descricao: userStory.descricao,
        estimativa_tempo: userStory.estimativa_tempo,
        swimlane: userStory.swimlane.id,
      };
    });

    return response;
  }

  findOne(id: number) {
    return `This action returns a #${id} userStory`;
  }

  async findFromSwimlane(swimlane: number) {
    return await this.userStoryRepository.find({
      where: { swimlane: { id: swimlane } },
    });
  }

  async create(createUserStoryDto: CreateUserStoryDto) {
    console.log(createUserStoryDto);
    const entity = this.userStoryRepository.create(createUserStoryDto);

    console.log(entity);
    return this.userStoryRepository.save(entity);
  }

  update(id: number, updateUserStoryDto: UpdateUserStoryDto) {
    return `This action updates a #${id} userStory`;
  }

  remove(id: number) {
    return `This action removes a #${id} userStory`;
  }
}
