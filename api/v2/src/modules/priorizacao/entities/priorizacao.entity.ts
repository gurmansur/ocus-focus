import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('priorizacao_stakeholders')
export class Priorizacao {
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
  classificacaoRequisito: string;

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
  respostaPositiva: string;

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
  respostaNegativa: string;

  @PrimaryGeneratedColumn({ type: 'int', name: 'PRS_ID' })
  id: number;
}
