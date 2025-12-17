import { Logger } from '@nestjs/common';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeRemove,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ColaboradorProjeto } from '../../colaborador-projeto/entities/colaborador-projeto.entity';
import { Colaborador } from '../../colaborador/entities/colaborador.entity';
import { Priorizacao } from '../../priorizacao/entities/priorizacao.entity';
import { Stakeholder } from '../../stakeholder/entities/stakeholder.entity';
import { StatusPriorizacao } from '../../status-priorizacao/entities/status-priorizacao.entity';

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
