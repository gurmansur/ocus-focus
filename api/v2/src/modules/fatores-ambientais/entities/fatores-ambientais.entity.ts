import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fatores_ambientais')
export class FatoresAmbientais {
  @PrimaryGeneratedColumn({ type: 'int', name: 'AMB_ID' })
  id: number;

  @Column('varchar', { name: 'AMB_DESCRICAO', length: 255 })
  descricao: string;

  @Column('double', { name: 'AMB_PESO', precision: 4, scale: 2 })
  peso: number;
}
