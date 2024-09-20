import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('SPRINTS')
export class Sprint {
  @PrimaryGeneratedColumn({ type: 'int', name: 'spr_id' })
  id: number;

  @Column({ type: 'string', name: 'spr_nome' })
  nome: string;

  @Column({ type: 'string', name: 'spr_descricao' })
  descricao: string;

  @Column({ type: 'int', name: 'spr_horas_previstas' })
  horas_previstas: number;

  @Column({ type: 'date', name: 'spr_data_inicio' })
  data_inicio: Date;

  @Column({ type: 'date', name: 'spr_data_fim' })
  data_fim: Date;
}
