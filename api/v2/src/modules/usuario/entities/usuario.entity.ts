import { Logger } from '@nestjs/common';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeRemove,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CasoDeTeste } from '../../caso-de-teste/entities/caso-de-teste.entity';
import { Priorizacao } from '../../priorizacao/entities/priorizacao.entity';
import { StatusPriorizacao } from '../../status-priorizacao/entities/status-priorizacao.entity';
import { Comentario } from '../../user-story/entities/comentario.entity';
import { UserStory } from '../../user-story/entities/user-story.entity';
import { UserRole } from '../enums/user-role.enum';

@Entity('USUARIOS')
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'int', name: 'USU_ID' })
  id: number;

  @Column('varchar', { name: 'USU_NOME', length: 100 })
  nome: string;

  @Column('varchar', { name: 'USU_EMAIL', length: 255, unique: true })
  email: string;

  @Column('varchar', { name: 'USU_SENHA', length: 100 })
  senha: string;

  @Column('varchar', { name: 'USU_EMPRESA', length: 100, nullable: true })
  empresa: string;

  @Column('varchar', { name: 'USU_CARGO', length: 100, nullable: true })
  cargo: string;

  @Column({
    type: 'enum',
    name: 'USU_TIPO',
    enum: UserRole,
    default: UserRole.COLABORADOR,
  })
  tipo: UserRole;

  @CreateDateColumn({ type: 'timestamp', name: 'USU_DATA_CADASTRO' })
  dataCadastro: Date;

  // Relationships
  @OneToMany(() => Priorizacao, (priorizacao) => priorizacao.usuario)
  priorizacoes: Priorizacao[];

  @OneToMany(
    () => StatusPriorizacao,
    (statusPriorizacao) => statusPriorizacao.usuario,
  )
  statusPriorizacao: StatusPriorizacao[];

  @OneToMany(
    () => CasoDeTeste,
    (casoDeTeste) => casoDeTeste.testadorDesignado,
    {
      nullable: true,
    },
  )
  casosDeTeste: CasoDeTeste[];

  @OneToMany(() => UserStory, (userStory) => userStory.responsavel)
  responsavelUS: UserStory[];

  @OneToMany(() => UserStory, (userStory) => userStory.criador)
  criadorUS: UserStory[];

  @OneToMany(() => Comentario, (comentario) => comentario.usuario)
  comentarios: Comentario[];

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
