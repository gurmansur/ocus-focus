import { Projeto } from 'src/modules/projeto/entities/projeto.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('atores')
export class Ator extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ato_id' })
  id: number;

  @Column('varchar', { name: 'ato_nome', length: 255 })
  nome: string;

  @Column('enum', {
    name: 'ato_complexidade',
    enum: ['SIMPLES', 'MEDIO', 'COMPLEXO'],
    default: () => "'SIMPLES'",
  })
  complexidade: 'SIMPLES' | 'MEDIO' | 'COMPLEXO';

  @Column('varchar', { name: 'ato_descricao', length: 255 })
  descricao: string;

  @ManyToOne(() => Projeto, (projeto) => projeto.atores)
  projeto: Projeto;
}
