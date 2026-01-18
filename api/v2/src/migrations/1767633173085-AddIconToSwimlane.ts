import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIconToSwimlane1767633173085 implements MigrationInterface {
    name = 'AddIconToSwimlane1767633173085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`SWIMLANES\` ADD \`SWI_ICONE\` varchar(30) NULL`);
        await queryRunner.query(`ALTER TABLE \`SWIMLANES\` CHANGE \`SWI_VERTICAL\` \`SWI_VERTICAL\` tinyint(1) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`SUBTAREFAS\` CHANGE \`SBT_COMPLETADA\` \`SBT_COMPLETADA\` tinyint(1) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`SUBTAREFAS\` CHANGE \`SBT_COMPLETADA\` \`SBT_COMPLETADA\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`SWIMLANES\` CHANGE \`SWI_VERTICAL\` \`SWI_VERTICAL\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`SWIMLANES\` DROP COLUMN \`SWI_ICONE\``);
    }

}
