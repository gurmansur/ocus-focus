import { CasoUso } from 'src/modules/caso-uso/entities/caso-uso.entity';
import { Projeto } from 'src/modules/projeto/entities/projeto.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('requisitos_funcionais')
export class Requisito {
  @PrimaryGeneratedColumn({ type: 'int', name: 'REQ_ID' })
  id: number;

  @Column('varchar', { name: 'REQ_ESPECIFICACAO', length: 1000 })
  especificacao: string;

  @Column('varchar', { name: 'REQ_NOME', length: 100 })
  nome: string;

  @Column('int', { name: 'REQ_NUMERO_IDENTIFICADOR' })
  numeroIdentificador: number;

  @ManyToOne(() => Projeto, (projeto) => projeto.requisitos)
  projeto: Projeto;

  @OneToMany(() => CasoUso, (casoUso) => casoUso.requisitoFuncional)
  casosDeUso: CasoUso[];
}
