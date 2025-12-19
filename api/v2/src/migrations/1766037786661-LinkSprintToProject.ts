import { MigrationInterface, QueryRunner } from 'typeorm';

export class LinkSprintToProject1766037786661 implements MigrationInterface {
  name = 'LinkSprintToProject1766037786661';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`SPRINTS\` ADD \`FK_PROJETOS_PRO_ID\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`SPRINTS\` ADD CONSTRAINT \`FK_df9b4d76871e6c4d68abfed4295\` FOREIGN KEY (\`FK_PROJETOS_PRO_ID\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`SPRINTS\` DROP FOREIGN KEY \`FK_df9b4d76871e6c4d68abfed4295\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`SPRINTS\` DROP COLUMN \`FK_PROJETOS_PRO_ID\``,
    );
  }
}
