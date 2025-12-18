import { UserStoryMapper } from '../user-story/user-story.mapper';
import { SprintBo } from './bo/sprint.bo';
import { Sprint } from './entities/sprint.entity';

export class SprintMapper {
  static entityToBo(entity: Sprint): SprintBo {
    const bo = new SprintBo();
    bo.id = entity.id;
    bo.nome = entity.nome;
    bo.descricao = entity.descricao;
    bo.horas_previstas = entity.horas_previstas;
    bo.data_inicio = entity.data_inicio;
    bo.data_fim = entity.data_fim;
    bo.userStories = entity.userStories
      ? entity.userStories.map((us) => UserStoryMapper.entityToBo(us))
      : null;

    return bo;
  }
}
