import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPriorityAndDueDateToUserStory1768860192304 implements MigrationInterface {
    name = 'AddPriorityAndDueDateToUserStory1768860192304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` ADD \`UST_PRIORIDADE\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` ADD \`UST_DATA_VENCIMENTO\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`SWIMLANES\` CHANGE \`SWI_VERTICAL\` \`SWI_VERTICAL\` tinyint(1) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`SUBTAREFAS\` CHANGE \`SBT_COMPLETADA\` \`SBT_COMPLETADA\` tinyint(1) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`SUBTAREFAS\` CHANGE \`SBT_COMPLETADA\` \`SBT_COMPLETADA\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`SWIMLANES\` CHANGE \`SWI_VERTICAL\` \`SWI_VERTICAL\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` DROP COLUMN \`UST_DATA_VENCIMENTO\``);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` DROP COLUMN \`UST_PRIORIDADE\``);
    }

}
