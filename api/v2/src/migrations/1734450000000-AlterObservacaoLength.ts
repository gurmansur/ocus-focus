import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterObservacaoLength1734450000000 implements MigrationInterface {
  name = 'AlterObservacaoLength1734450000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE execucao_de_teste MODIFY COLUMN EDT_OBSERVACAO TEXT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE execucao_de_teste MODIFY COLUMN EDT_RESPOSTA TEXT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE execucao_de_teste MODIFY COLUMN EDT_OBSERVACAO VARCHAR(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE execucao_de_teste MODIFY COLUMN EDT_RESPOSTA VARCHAR(255) NULL`,
    );
  }
}
