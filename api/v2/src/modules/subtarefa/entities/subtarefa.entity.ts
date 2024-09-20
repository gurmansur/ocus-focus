import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Subtarefa {
  @PrimaryGeneratedColumn({ type: 'int', name: 'sbt_id' })
  id: number;

  @Column({ type: 'string', name: 'sbt_descricao' })
  descricao: string;
}
