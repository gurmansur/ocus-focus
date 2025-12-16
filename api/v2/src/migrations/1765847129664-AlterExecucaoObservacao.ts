import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterExecucaoObservacao1765847129664 implements MigrationInterface {
    name = 'AlterExecucaoObservacao1765847129664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`EXECUCOES_DE_TESTE\` DROP COLUMN \`EDT_OBSERVACAO\``);
        await queryRunner.query(`ALTER TABLE \`EXECUCOES_DE_TESTE\` ADD \`EDT_OBSERVACAO\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`EXECUCOES_DE_TESTE\` DROP COLUMN \`EDT_OBSERVACAO\``);
        await queryRunner.query(`ALTER TABLE \`EXECUCOES_DE_TESTE\` ADD \`EDT_OBSERVACAO\` varchar(255) NULL`);
    }

}
