import { CasoDeTeste } from 'src/modules/caso-de-teste/entities/caso-de-teste.entity';
import { Cenario } from 'src/modules/cenarios/entities/cenario.entity';
import { RequisitoFuncional } from 'src/modules/requisito/entities/requisito-funcional.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('CASOS_DE_USO')
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
    default: 'SIMPLES',
  })
  complexidade: 'SIMPLES' | 'MEDIO' | 'COMPLEXO';

  @ManyToOne(
    () => RequisitoFuncional,
    (requisitoFuncional: RequisitoFuncional) => requisitoFuncional.casosDeUso,
  )
  @JoinColumn({ name: 'FK_REQUISITOS_FUNCIONAIS_REQ_ID' })
  requisitoFuncional: RequisitoFuncional;

  @OneToMany(() => Cenario, (cenario) => cenario.casoUso)
  @JoinColumn({ name: 'FK_CASOS_DE_USO_CAS_ID' })
  cenarios: Cenario[];

  @OneToMany(() => CasoDeTeste, (casoDeTeste) => casoDeTeste.casoDeUso, {
    nullable: true,
  })
  @JoinColumn({ name: 'FK_CASOS_DE_USO_CAS_ID' })
  casosDeTeste: CasoDeTeste[];
}
