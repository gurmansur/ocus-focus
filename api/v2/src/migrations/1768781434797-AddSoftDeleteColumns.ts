import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteColumns1768781434797 implements MigrationInterface {
    name = 'AddSoftDeleteColumns1768781434797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`COMENTARIOS\` ADD \`CMN_DATA_EXCLUSAO\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` ADD \`UST_DATA_EXCLUSAO\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`SWIMLANES\` CHANGE \`SWI_VERTICAL\` \`SWI_VERTICAL\` tinyint(1) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`SUBTAREFAS\` CHANGE \`SBT_COMPLETADA\` \`SBT_COMPLETADA\` tinyint(1) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`COMENTARIOS\` CHANGE \`CMN_CRIADO_EM\` \`CMN_CRIADO_EM\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`COMENTARIOS\` CHANGE \`CMN_MODIFICADO_EM\` \`CMN_MODIFICADO_EM\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` CHANGE \`UST_MODIFICADO_EM\` \`UST_MODIFICADO_EM\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` CHANGE \`UST_MODIFICADO_EM\` \`UST_MODIFICADO_EM\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`COMENTARIOS\` CHANGE \`CMN_MODIFICADO_EM\` \`CMN_MODIFICADO_EM\` datetime(0) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`COMENTARIOS\` CHANGE \`CMN_CRIADO_EM\` \`CMN_CRIADO_EM\` datetime(0) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`SUBTAREFAS\` CHANGE \`SBT_COMPLETADA\` \`SBT_COMPLETADA\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`SWIMLANES\` CHANGE \`SWI_VERTICAL\` \`SWI_VERTICAL\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` DROP COLUMN \`UST_DATA_EXCLUSAO\``);
        await queryRunner.query(`ALTER TABLE \`COMENTARIOS\` DROP COLUMN \`CMN_DATA_EXCLUSAO\``);
    }

}
