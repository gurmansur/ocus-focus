import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fatores_tecnicos')
export class FatoresTecnico {
  @PrimaryGeneratedColumn({ type: 'int', name: 'TEC_ID' })
  id: number;

  @Column('varchar', { name: 'TEC_DESCRICAO', length: 50 })
  descricao: string;

  @Column('double', { name: 'TEC_PESO', precision: 4, scale: 2 })
  peso: number;
}
