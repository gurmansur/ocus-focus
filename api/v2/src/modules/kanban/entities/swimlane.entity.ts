import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Kanban } from './kanban.entity';

@Entity('SWIMLANES')
export class Swimlane {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SWI_ID' })
  id: number;

  @Column({ type: 'varchar', name: 'SWI_NOME' })
  nome: string;

  @Column({ type: 'tinyint', width: 1, name: 'SWI_COR' })
  vertical: boolean;

  @Column({ type: 'timestamp', name: 'SWI_CRIADO' })
  criadoEm: Date;

  @Column({ type: 'timestamp', name: 'SWI_ATUALIZADO' })
  atualizadoEm: Date;

  @ManyToOne(() => Kanban, (kanban) => kanban.swinlanes)
  @JoinColumn({ name: 'FK_KANBAN_KAN_ID' })
  kanban: Kanban;
}
