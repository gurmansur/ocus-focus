import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { UserStory } from '../user-story/entities/user-story.entity';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { Comentario } from './entities/comentario.entity';

@Injectable()
export class ComentarioService {
  constructor(
    @InjectRepository(Comentario)
    private readonly comentarioRepository: Repository<Comentario>,
    @InjectRepository(UserStory)
    private readonly userStoryRepository: Repository<UserStory>,
    @InjectRepository(Colaborador)
    private readonly colaboradorRepository: Repository<Colaborador>,
  ) {}

  async create(createComentarioDto: CreateComentarioDto) {
    // busca o usuário que fez o comentário
    const usuario = await this.findColaborador(createComentarioDto.usuario_id);

    // busca a user story que recebeu o comentário
    const userStory = await this.findUserStory(
      createComentarioDto.user_story_id,
    );

    // cria o comentário
    const comentario = this.comentarioRepository.create({
      comentario: createComentarioDto.comentario,
      usuario,
      userStory,
    });

    // tenta salvar e lança um erro caso não consiga
    try {
      const { id } = await this.comentarioRepository.save(comentario);
      return id;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllFromUserStory(id: number) {
    if (typeof id != 'number' || !id)
      throw new BadRequestException('Id não definido');

    try {
      const comentarios = await this.comentarioRepository.find({
        where: {
          userStory: {
            id,
          },
        },
        relations: ['usuario', 'userStory'],
      });

      const comentariosTratados = comentarios.map((comentario) => {
        return {
          id: comentario.id,
          comentario: comentario.comentario,
          nome_usuario: comentario.usuario.nome,
          user_story_id: comentario.userStory.id,
        };
      });

      // talvez eu poderia retornar um objeto ao invés de um array direto
      // mas não sei se seria melhor
      return comentariosTratados;
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const comentario = await this.comentarioRepository.findOneOrFail({
        where: { id },
      });
      return {
        comentario,
      };
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Comentário não encontrado');
    }
  }

  update(id: number, updateComentarioDto: UpdateComentarioDto) {
    return `This action updates a #${id} comentario`;
  }

  remove(id: number) {
    try {
      this.comentarioRepository.delete(id);
      return 'Comentário deletado com sucesso';
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async findColaborador(id: number) {
    const colaborador = await this.colaboradorRepository.findOne({
      where: { id },
    });
    if (!colaborador) throw new NotFoundException('Colaborador não encontrado');
    return colaborador;
  }

  private async findUserStory(id: number) {
    const userStory = await this.userStoryRepository.findOne({
      where: { id },
    });
    if (!userStory) throw new NotFoundException('User Story não encontrada');
    return userStory;
  }
}
