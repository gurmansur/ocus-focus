import { Kanban } from '../kanban/entities/kanban.entity';
import { Swimlane } from '../kanban/entities/swimlane.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateUserStoryBo } from './bo/create-user-story.bo';
import { UserStory } from './entities/user-story.entity';

export class UserStoryMapper {
  // TODO adicionar as outras informações da user story aqui
  static createUserStoryBoToEntity(bo: CreateUserStoryBo): UserStory {
    const entity = new UserStory();
    entity.titulo = bo.titulo;
    entity.descricao = bo.descricao;
    entity.estimativa_tempo = bo.estimativa_tempo;
    entity.swimlane = bo.swimlane ? ({ id: bo.swimlane } as Swimlane) : null;
    entity.kanban = bo.kanban ? ({ id: bo.kanban } as Kanban) : null;
    entity.criador = bo.usuario ? ({ id: bo.usuario } as Usuario) : null;
    entity.projeto = bo.projeto ? ({ id: bo.projeto } as Projeto) : null;

    return entity;
  }

  // TODO fazer os arquivos base de dto e de bo
  static boToDto() {}
}
