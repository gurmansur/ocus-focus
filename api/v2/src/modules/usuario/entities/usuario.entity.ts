import { ColaboradorProjeto } from 'src/modules/colaborador-projeto/entities/colaborador-projeto.entity';
import { Colaborador } from 'src/modules/colaborador/entities/colaborador.entity';
import { Priorizacao } from 'src/modules/priorizacao/entities/priorizacao.entity';
import { Stakeholder } from 'src/modules/stakeholder/entities/stakeholder.entity';
import { StatusPriorizacao } from 'src/modules/status-priorizacao/entities/status-priorizacao.entity';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeRemove,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('USUARIOS')
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'int', name: 'USU_ID' })
  id: number;

  @Column('date', { name: 'USU_DATA_CADASTRO' })
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
    console.log('Inserted usuario with id:', this.id);
  }

  @AfterUpdate()
  async afterUpdate() {
    console.log('Updated usuario with id:', this.id);
  }

  @BeforeRemove()
  async beforeRemove() {
    console.log('Removing usuario with id:', this.id);
  }

  @AfterLoad()
  async afterLoad() {
    console.log('Loaded usuario with id:', this.id);
  }
}
