import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CasoUso } from '../../caso-uso/entities/caso-uso.entity';

@Entity('CENARIOS')
export class Cenario {
  @PrimaryGeneratedColumn({ type: 'int', name: 'CEN_ID' })
  id: number;

  @Column('varchar', { name: 'CEN_NOME', length: 50 })
  nome: string;

  @Column('varchar', { name: 'CEN_DESCRICAO', length: 255 })
  descricao: string;

  @Column('enum', {
    name: 'CEN_TIPO',
    enum: ['PRINCIPAL', 'ALTERNATIVO'],
    default: 'PRINCIPAL',
  })
  tipo: 'PRINCIPAL' | 'ALTERNATIVO';

  @ManyToOne(() => CasoUso, (casoUso) => casoUso.cenarios)
  @JoinColumn({ name: 'FK_CASOS_DE_USO_CAS_ID' })
  casoUso: CasoUso;
}
