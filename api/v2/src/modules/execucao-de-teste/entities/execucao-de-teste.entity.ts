import { CasoDeTeste } from 'src/modules/caso-de-teste/entities/caso-de-teste.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('EXECUCOES_DE_TESTE')
export class ExecucaoDeTeste {
  @PrimaryGeneratedColumn({ type: 'int', name: 'EDT_ID' })
  id: number;

  @Column('varchar', { name: 'EDT_NOME', length: 50 })
  nome: string;

  @Column('timestamp', { name: 'EDT_DATA_EXECUCAO' })
  dataExecucao: Date;

  @Column('varchar', { name: 'EDT_RESPOSTA', length: 255 })
  resposta: string;

  @Column('enum', {
    name: 'EDT_RESULTADO',
    enum: ['SUCESSO', 'FALHA', 'PENDENTE'],
    default: 'PENDENTE',
  })
  resultado: 'SUCESSO' | 'FALHA' | 'PENDENTE';

  @Column('enum', {
    name: 'EDT_METODO',
    enum: ['MANUAL', 'AUTOMATIZADO'],
    default: 'MANUAL',
  })
  metodo: 'MANUAL' | 'AUTOMATIZADO';

  @ManyToOne(() => CasoDeTeste, (casoDeTeste) => casoDeTeste.execucoesDeTeste)
  @JoinColumn({ name: 'FK_CASO_DE_TESTE_CDT_ID' })
  casoDeTeste: CasoDeTeste;
}
