import { Cenario } from 'src/modules/cenarios/entities/cenario.entity';
import { Projeto } from 'src/modules/projeto/entities/projeto.entity';
import { Requisito } from 'src/modules/requisito/entities/requisito.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('casos_de_uso')
export class CasoUso {
  @PrimaryGeneratedColumn({ type: 'int', name: 'CAS_ID' })
  id: number;

  @Column('varchar', { name: 'CAS_NOME', length: 50 })
  nome: string;

  @Column('varchar', { name: 'CAS_DESCRICAO', length: 255 })
  descricao: string;

  @Column('enum', {
    name: 'CAS_COMPLEXIDADE',
    enum: ['SIMPLES', 'MEDIO', 'COMPLEXO'],
    default: () => "'SIMPLES'",
  })
  complexidade: 'SIMPLES' | 'MEDIO' | 'COMPLEXO';

  @ManyToOne(
    () => Requisito,
    (requisitoFuncional) => requisitoFuncional.casosDeUso,
  )
  requisitoFuncional: Requisito;

  @ManyToOne(() => Projeto, (projeto) => projeto.casosDeUso)
  projeto: Projeto;

  @OneToMany(() => Cenario, (cenario) => cenario.casoUso)
  cenarios: Cenario[];
}
