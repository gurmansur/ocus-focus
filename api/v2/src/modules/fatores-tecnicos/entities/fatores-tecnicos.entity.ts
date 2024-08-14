import { FatorTecnicoProjeto } from 'src/modules/fator-tecnico-projeto/entities/fator-tecnico-projeto.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('FATORES_TECNICOS')
export class FatorTecnico {
  @PrimaryGeneratedColumn({ type: 'int', name: 'TEC_ID' })
  id: number;

  @Column('varchar', { name: 'TEC_DESCRICAO', length: 50 })
  descricao: string;

  @Column('double', { name: 'TEC_PESO', precision: 4, scale: 2 })
  peso: number;

  @OneToMany(
    () => FatorTecnicoProjeto,
    (fatorTecnicoProjeto) => fatorTecnicoProjeto.fatorTecnico,
  )
  projetos: FatorTecnicoProjeto[];
}
