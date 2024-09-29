import { Stakeholder } from 'src/modules/stakeholder/entities/stakeholder.entity';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('STATUS_PRIORIZACAO')
export class StatusPriorizacao {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SPA_ID' })
  id: number;

  @Column('boolean', { name: 'SPA_PARTICIPACAO_REALIZADA', default: false })
  participacaoRealizada: boolean;

  @Column('boolean', { name: 'SPA_ALERTA_EMITIDO', default: false })
  alertaEmitido: boolean;

  @ManyToOne(() => Stakeholder, (stakeholder) => stakeholder.statusPriorizacao)
  @JoinColumn({ name: 'FK_STAKEHOLDERS_STA_ID' })
  stakeholder: Stakeholder;

  @ManyToOne(() => Usuario, (usuario) => usuario.statusPriorizacao)
  @JoinColumn({ name: 'FK_STAKEHOLDERS_FK_USUARIOS_USU_ID' })
  usuario: Usuario;
}
