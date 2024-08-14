import { Stakeholder } from 'src/modules/stakeholder/entities/stakeholder.entity';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('PRIORIZACAO_STAKEHOLDERS')
export class Priorizacao {
  @PrimaryGeneratedColumn({ type: 'int', name: 'PRS_ID' })
  id: number;

  @Column('enum', {
    name: 'PRS_CLASSIFICACAO_REQUISITO',
    enum: [
      'DEVE SER FEITO',
      'PERFORMANCE',
      'ATRATIVO',
      'INDIFERENTE',
      'QUESTIONAVEL',
      'REVERSO',
    ],
  })
  classificacaoRequisito:
    | 'DEVE SER FEITO'
    | 'PERFORMANCE'
    | 'ATRATIVO'
    | 'INDIFERENTE'
    | 'QUESTIONAVEL'
    | 'REVERSO';

  @Column('enum', {
    name: 'PRS_RESPOSTA_POSITIVA',
    enum: [
      'GOSTARIA',
      'ESPERADO',
      'NAO IMPORTA',
      'CONVIVO COM ISSO',
      'NAO GOSTARIA',
    ],
  })
  respostaPositiva:
    | 'GOSTARIA'
    | 'ESPERADO'
    | 'NAO IMPORTA'
    | 'CONVIVO COM ISSO'
    | 'NAO GOSTARIA';

  @Column('enum', {
    name: 'PRS_RESPOSTA_NEGATIVA',
    enum: [
      'GOSTARIA',
      'ESPERADO',
      'NAO IMPORTA',
      'CONVIVO COM ISSO',
      'NAO GOSTARIA',
    ],
  })
  respostaNegativa:
    | 'GOSTARIA'
    | 'ESPERADO'
    | 'NAO IMPORTA'
    | 'CONVIVO COM ISSO'
    | 'NAO GOSTARIA';

  @ManyToOne(() => Stakeholder, (stakeholder) => stakeholder.priorizacoes)
  @JoinColumn({ name: 'FK_STAKEHOLDERS_STA_ID' })
  stakeholder: Stakeholder;

  @ManyToOne(() => Usuario, (usuario) => usuario.priorizacoes)
  @JoinColumn({ name: 'FK_STAKEHOLDERS_FK_USUARIOS_USU_ID' })
  usuario: Usuario;
}
