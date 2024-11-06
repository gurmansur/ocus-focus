import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { Kanban } from '../kanban/entities/kanban.entity';
import { Swimlane } from '../kanban/entities/swimlane.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CreateUserStoryBo } from './bo/create-user-story.bo';
import { UserStoryBo } from './bo/user-story.bo';
import { UserStoryDto } from './dto/user-story.dto';
import { UserStory } from './entities/user-story.entity';

export class UserStoryMapper {
  static createUserStoryBoToEntity(bo: CreateUserStoryBo): UserStory {
    const entity = new UserStory();
    entity.titulo = bo.titulo;
    entity.descricao = bo.descricao;
    entity.estimativa_tempo = bo.estimativa_tempo;
    entity.swimlane = bo.swimlane ? ({ id: bo.swimlane } as Swimlane) : null;
    entity.kanban = bo.kanban ? ({ id: bo.kanban } as Kanban) : null;
    entity.criador = bo.usuario ? ({ id: bo.usuario } as Colaborador) : null;
    entity.projeto = bo.projeto ? ({ id: bo.projeto } as Projeto) : null;

    return entity;
  }

  static boToDto(bo: UserStoryBo): UserStoryDto {
    const dto = new UserStoryDto();
    dto.id = bo.id;
    dto.titulo = bo.titulo;
    dto.descricao = bo.descricao;
    dto.criador = bo.criador;
    dto.responsavel = bo.responsavel;
    dto.projeto = bo.projeto;
    dto.sprints = bo.sprints;

    return dto;
  }

  static entityToBo(entity: UserStory): UserStoryBo {
    const bo = new UserStoryBo();
    bo.id = entity.id;
    bo.titulo = entity.titulo;
    bo.descricao = entity.descricao;
    bo.criador = entity.criador;
    bo.responsavel = entity.responsavel;
    bo.projeto = entity.projeto;

    return bo;
  }
}
