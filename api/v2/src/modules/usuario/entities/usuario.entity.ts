import { Logger } from '@nestjs/common';
import { ColaboradorProjeto } from 'src/modules/colaborador-projeto/entities/colaborador-projeto.entity';
import { Colaborador } from 'src/modules/colaborador/entities/colaborador.entity';
import { Priorizacao } from 'src/modules/priorizacao/entities/priorizacao.entity';
import { Stakeholder } from 'src/modules/stakeholder/entities/stakeholder.entity';
import { StatusPriorizacao } from 'src/modules/status-priorizacao/entities/status-priorizacao.entity';
import { Comentario } from 'src/modules/user-story/entities/comentario.entity';
import { UserStory } from 'src/modules/user-story/entities/user-story.entity';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeRemove,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('USUARIOS')
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'int', name: 'USU_ID' })
  id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'USU_DATA_CADASTRO' })
  dataCadastro: Date;

  @OneToMany(() => Colaborador, (colaborador) => colaborador.usuario)
  colaboradores: Colaborador[];

  @OneToMany(() => Stakeholder, (stakeholder) => stakeholder.usuario)
  stakeholders: Stakeholder[];

  @OneToMany(() => Priorizacao, (priorizacao) => priorizacao.usuario)
  priorizacoes: Priorizacao[];

  @OneToMany(() => ColaboradorProjeto, (projeto) => projeto.usuario)
  projetos: ColaboradorProjeto[];

  @OneToMany(
    () => StatusPriorizacao,
    (statusPriorizacao) => statusPriorizacao.usuario,
  )
  statusPriorizacao: StatusPriorizacao[];

  @OneToMany(() => Comentario, (comentario) => comentario.usuario)
  comentarios: Comentario[];

  @OneToMany(() => UserStory, (userStory) => userStory.responsavel)
  responsavelUS: UserStory[];

  @OneToMany(() => UserStory, (userStory) => userStory.criador)
  criadorUS: UserStory[];

  @ManyToMany(() => UserStory, (userStory) => userStory.participantes)
  participantesUS: UserStory[];

  @AfterInsert()
  async afterInsert() {
    Logger.log('Inserted usuario with id: ' + this.id, 'Usuario');
  }

  @AfterUpdate()
  async afterUpdate() {
    Logger.log('Updated usuario with id: ' + this.id, 'Usuario');
  }

  @BeforeRemove()
  async beforeRemove() {
    Logger.log('Removed usuario with id: ' + this.id, 'Usuario');
  }

  @AfterLoad()
  async afterLoad() {
    Logger.log('Loaded usuario with id: ' + this.id, 'Usuario');
  }
}
