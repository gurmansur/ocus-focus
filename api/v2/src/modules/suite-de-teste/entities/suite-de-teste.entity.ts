import { CasoDeTeste } from 'src/modules/caso-de-teste/entities/caso-de-teste.entity';
import { Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('SUITES_DE_TESTE')
export class SuiteDeTeste {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SDT_ID' })
  id: number;

  @OneToMany(() => CasoDeTeste, (casoDeTeste) => casoDeTeste.suiteDeTeste)
  @JoinColumn({ name: 'FK_SUITE_DE_TESTE_SDT_ID' })
  casosDeTeste: CasoDeTeste[];
}
