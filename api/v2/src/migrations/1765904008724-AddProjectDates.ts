import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectDates1765904008724 implements MigrationInterface {
  name = 'AddProjectDates1765904008724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`PROJETOS\` ADD \`PRO_DATA_CRIACAO\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`PROJETOS\` ADD \`PRO_DATA_ATUALIZACAO\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`PROJETOS\` ADD \`PRO_DATA_EXCLUSAO\` datetime(6) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`PROJETOS\` DROP COLUMN \`PRO_DATA_EXCLUSAO\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`PROJETOS\` DROP COLUMN \`PRO_DATA_ATUALIZACAO\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`PROJETOS\` DROP COLUMN \`PRO_DATA_CRIACAO\``,
    );
  }
}
