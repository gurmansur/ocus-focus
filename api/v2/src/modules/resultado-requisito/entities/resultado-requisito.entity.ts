import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RequisitoFuncional } from '../../requisito/entities/requisito-funcional.entity';

@Entity('RESULTADO_REQUISITOS')
export class ResultadoRequisito {
  @PrimaryGeneratedColumn({ type: 'int', name: 'RPR_ID' })
  id: number;

  @Column('enum', {
    name: 'RPR_RESULTADO_FINAL',
    enum: [
      'DEVE SER FEITO',
      'PERFORMANCE',
      'ATRATIVO',
      'INDIFERENTE',
      'QUESTIONAVEL',
      'REVERSO',
    ],
  })
  resultadoFinal:
    | 'DEVE SER FEITO'
    | 'PERFORMANCE'
    | 'ATRATIVO'
    | 'INDIFERENTE'
    | 'QUESTIONAVEL'
    | 'REVERSO';

  @ManyToOne(
    () => RequisitoFuncional,
    (requisitoFuncional) => requisitoFuncional.resultados,
  )
  @JoinColumn({ name: 'FK_REQUISITOS_FUNCIONAIS_REQ_ID' })
  requisitoFuncional: RequisitoFuncional;
}
