import { CasoUso } from 'src/modules/caso-uso/entities/caso-uso.entity';
import { Priorizacao } from 'src/modules/priorizacao/entities/priorizacao.entity';
import { Projeto } from 'src/modules/projeto/entities/projeto.entity';
import { ResultadoRequisito } from 'src/modules/resultado-requisito/entities/resultado-requisito.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('REQUISITOS_FUNCIONAIS')
export class RequisitoFuncional {
  @PrimaryGeneratedColumn({ type: 'int', name: 'REQ_ID' })
  id: number;

  @Column('varchar', { name: 'REQ_ESPECIFICACAO', length: 1000 })
  especificacao: string;

  @Column('varchar', { name: 'REQ_NOME', length: 100 })
  nome: string;

  @Column('int', { name: 'REQ_NUMERO_IDENTIFICADOR' })
  numeroIdentificador: number;

  @ManyToOne(() => Projeto, (projeto) => projeto.requisitos)
  @JoinColumn({ name: 'FK_PROJETOS_PRO_ID' })
  projeto: Projeto;

  @OneToMany(() => CasoUso, (casoUso) => casoUso.requisitoFuncional)
  casosDeUso: CasoUso[];

  @OneToMany(
    () => ResultadoRequisito,
    (resultadoRequisito) => resultadoRequisito.requisitoFuncional,
  )
  resultados: ResultadoRequisito[];

  @OneToMany(() => Priorizacao, (priorizacao) => priorizacao.requisitoFuncional)
  priorizacoes: Priorizacao[];
}
