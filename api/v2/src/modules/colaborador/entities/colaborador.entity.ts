import { CasoUso } from 'src/modules/caso-uso/entities/caso-uso.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('colaboradores')
export class Colaborador {
  @PrimaryGeneratedColumn({ type: 'int', name: 'CEN_ID' })
  id: number;

  @Column('varchar', { name: 'CEN_NOME', length: 50 })
  nome: string;

  @Column('varchar', { name: 'CEN_DESCRICAO', length: 255 })
  descricao: string;

  @Column('enum', {
    name: 'CEN_TIPO',
    enum: ['PRINCIPAL', 'ALTERNATIVO'],
    default: () => "'PRINCIPAL'",
  })
  tipo: 'PRINCIPAL' | 'ALTERNATIVO';

  @ManyToOne(() => CasoUso, (casoUso) => casoUso.cenarios)
  casoUso: CasoUso;
}
