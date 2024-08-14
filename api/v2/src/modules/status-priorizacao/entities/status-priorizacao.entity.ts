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
  // SPA_ID INTEGER PRIMARY KEY AUTO_INCREMENT,
  // SPA_PARTICIPACAO_REALIZADA BOOLEAN,
  // SPA_ALERTA_EMITIDO BOOLEAN,
  // FK_STAKEHOLDERS_STA_ID INTEGER,
  // FK_STAKEHOLDERS_FK_USUARIOS_USU_ID INTEGER

  @PrimaryGeneratedColumn({ type: 'int', name: 'SPA_ID' })
  id: number;

  @Column('boolean', { name: 'SPA_PARTICIPACAO_REALIZADA' })
  participacaoRealizada: boolean;

  @Column('boolean', { name: 'SPA_ALERTA_EMITIDO' })
  alertaEmitido: boolean;

  @ManyToOne(() => Stakeholder, (stakeholder) => stakeholder.statusPriorizacao)
  @JoinColumn({ name: 'FK_STAKEHOLDERS_STA_ID' })
  stakeholder: Stakeholder;

  @ManyToOne(() => Usuario, (usuario) => usuario.statusPriorizacao)
  @JoinColumn({ name: 'FK_STAKEHOLDERS_FK_USUARIOS_USU_ID' })
  usuario: Usuario;
}
