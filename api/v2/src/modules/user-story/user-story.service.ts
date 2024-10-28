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
  async findAll(projetoId: Projeto, page: number, pageSize: number) {
    if (!projetoId)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    const take = pageSize ? pageSize : 10;
    const skip = page ? page * take : 0;
    const [items, count] = await this.userStoryRepository.findAndCount({
      where: { projeto: { id: projetoId.id } },
      take,
      skip,
    });

    return {
      items,
      page: {
        size: take,
        totalElements: count,
        totalPages: Math.ceil(count / take),
        number: page ? page : 0,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} userStory`;
  }

  async create(createUserStoryDto: CreateUserStoryDto, projetoId: number) {
    // const userStory = this.userStoryRepository.create(createUserStoryDto);
    // return await this.userStoryRepository.save(userStory);
  }

  update(id: number, updateUserStoryDto: UpdateUserStoryDto) {
    return `This action updates a #${id} userStory`;
  }

  remove(id: number) {
    return `This action removes a #${id} userStory`;
  }
}
