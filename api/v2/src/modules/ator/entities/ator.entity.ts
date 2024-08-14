import { Projeto } from 'src/modules/projeto/entities/projeto.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('ATORES')
export class Ator extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ATO_ID' })
  id: number;

  @Column('varchar', { name: 'ATO_NOME', length: 30 })
  nome: string;

  @Column('enum', {
    name: 'ATO_COMPLEXIDADE',
    enum: ['SIMPLES', 'MEDIO', 'COMPLEXO'],
    default: 'SIMPLES',
  })
  complexidade: 'SIMPLES' | 'MEDIO' | 'COMPLEXO';

  @Column('varchar', { name: 'ATO_DESCRICAO', length: 255 })
  descricao: string;

  @ManyToOne(() => Projeto, (projeto) => projeto.atores)
  @JoinColumn({ name: 'FK_PROJETOS_PRO_ID' })
  projeto: Projeto;
}
