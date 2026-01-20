import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEstimativaForeignKeyToUsuario1768865713033 implements MigrationInterface {
  name = 'UpdateEstimativaForeignKeyToUsuario1768865713033';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP FOREIGN KEY \`FK_2e797f4798e9484066194623f87\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`FK_COLABORADORES_COL_ID\` \`FK_USUARIOS_USU_ID\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`SWIMLANES\` CHANGE \`SWI_VERTICAL\` \`SWI_VERTICAL\` tinyint(1) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`SUBTAREFAS\` CHANGE \`SBT_COMPLETADA\` \`SBT_COMPLETADA\` tinyint(1) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD CONSTRAINT \`FK_418d7a47e182285a58cd0531b37\` FOREIGN KEY (\`FK_USUARIOS_USU_ID\`) REFERENCES \`USUARIOS\`(\`USU_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP FOREIGN KEY \`FK_418d7a47e182285a58cd0531b37\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`SUBTAREFAS\` CHANGE \`SBT_COMPLETADA\` \`SBT_COMPLETADA\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`SWIMLANES\` CHANGE \`SWI_VERTICAL\` \`SWI_VERTICAL\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`FK_USUARIOS_USU_ID\` \`FK_COLABORADORES_COL_ID\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD CONSTRAINT \`FK_2e797f4798e9484066194623f87\` FOREIGN KEY (\`FK_COLABORADORES_COL_ID\`) REFERENCES \`COLABORADORES\`(\`COL_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
