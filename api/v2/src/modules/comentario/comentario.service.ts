import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColaboradorService } from '../colaborador/colaborador.service';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { UserStory } from '../user-story/entities/user-story.entity';
import { UserStoryService } from '../user-story/user-story.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { Comentario } from './entities/comentario.entity';

@Injectable()
export class ComentarioService {
  constructor(
    @InjectRepository(Comentario)
    private readonly comentarioRepository: Repository<Comentario>,
    @Inject() private readonly colaboradorService: ColaboradorService,
    @Inject() private readonly userStoryService: UserStoryService,
    @InjectRepository(UserStory)
    private readonly userStoryRepository: Repository<UserStory>,
    @InjectRepository(Colaborador)
    private readonly colaboradorRepository: Repository<Colaborador>,
  ) {}
  async create(createComentarioDto: CreateComentarioDto) {
    const usuario = await this.colaboradorService.findOne(
      createComentarioDto.usuario_id,
    );
    if (!usuario) return 'Usuário não encontrado';

    const userStory = await this.userStoryService.findOneFullInformation(
      createComentarioDto.user_story_id,
    );
    if (!userStory) return 'User Story não encontrada';

    const comentario = this.comentarioRepository.create({
      comentario: createComentarioDto.comentario,
      usuario,
      userStory,
    });

    try {
      await this.comentarioRepository.save(comentario);
      return 'Comentário criado com sucesso';
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all comentario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comentario`;
  }

  update(id: number, updateComentarioDto: UpdateComentarioDto) {
    return `This action updates a #${id} comentario`;
  }

  remove(id: number) {
    return `This action removes a #${id} comentario`;
  }
}
