import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserStoryToUsuario1768859093855 implements MigrationInterface {
    name = 'UpdateUserStoryToUsuario1768859093855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` DROP FOREIGN KEY \`FK_28a13d2b8b6e2907e9f73b0812e\``);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` DROP FOREIGN KEY \`FK_48311ce7e29574d5cbe2e57de23\``);
        await queryRunner.query(`CREATE TABLE \`USER_STORIES_USUARIOS\` (\`uSERSTORIESUSTID\` int NOT NULL, \`uSUARIOSUSUID\` int NOT NULL, INDEX \`IDX_39207cc6c358b1e0c1579e8a1c\` (\`uSERSTORIESUSTID\`), INDEX \`IDX_ac619fefd4b923738ee1c9dd9a\` (\`uSUARIOSUSUID\`), PRIMARY KEY (\`uSERSTORIESUSTID\`, \`uSUARIOSUSUID\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` DROP COLUMN \`FK_COLABORADOR_COL_CRI_ID\``);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` DROP COLUMN \`FK_COLABORADOR_COL_RES_ID\``);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` ADD \`FK_USUARIO_USU_CRI_ID\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` ADD \`FK_USUARIO_USU_RES_ID\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`SWIMLANES\` CHANGE \`SWI_VERTICAL\` \`SWI_VERTICAL\` tinyint(1) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`SUBTAREFAS\` CHANGE \`SBT_COMPLETADA\` \`SBT_COMPLETADA\` tinyint(1) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` ADD CONSTRAINT \`FK_b49fa5a29592429faa310d94061\` FOREIGN KEY (\`FK_USUARIO_USU_CRI_ID\`) REFERENCES \`USUARIOS\`(\`USU_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` ADD CONSTRAINT \`FK_b208be2436c2af45728a8cf6af1\` FOREIGN KEY (\`FK_USUARIO_USU_RES_ID\`) REFERENCES \`USUARIOS\`(\`USU_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_USUARIOS\` ADD CONSTRAINT \`FK_39207cc6c358b1e0c1579e8a1cf\` FOREIGN KEY (\`uSERSTORIESUSTID\`) REFERENCES \`USER_STORIES\`(\`UST_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_USUARIOS\` ADD CONSTRAINT \`FK_ac619fefd4b923738ee1c9dd9a9\` FOREIGN KEY (\`uSUARIOSUSUID\`) REFERENCES \`USUARIOS\`(\`USU_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_USUARIOS\` DROP FOREIGN KEY \`FK_ac619fefd4b923738ee1c9dd9a9\``);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_USUARIOS\` DROP FOREIGN KEY \`FK_39207cc6c358b1e0c1579e8a1cf\``);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` DROP FOREIGN KEY \`FK_b208be2436c2af45728a8cf6af1\``);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` DROP FOREIGN KEY \`FK_b49fa5a29592429faa310d94061\``);
        await queryRunner.query(`ALTER TABLE \`SUBTAREFAS\` CHANGE \`SBT_COMPLETADA\` \`SBT_COMPLETADA\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`SWIMLANES\` CHANGE \`SWI_VERTICAL\` \`SWI_VERTICAL\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` DROP COLUMN \`FK_USUARIO_USU_RES_ID\``);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` DROP COLUMN \`FK_USUARIO_USU_CRI_ID\``);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` ADD \`FK_COLABORADOR_COL_RES_ID\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` ADD \`FK_COLABORADOR_COL_CRI_ID\` int NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_ac619fefd4b923738ee1c9dd9a\` ON \`USER_STORIES_USUARIOS\``);
        await queryRunner.query(`DROP INDEX \`IDX_39207cc6c358b1e0c1579e8a1c\` ON \`USER_STORIES_USUARIOS\``);
        await queryRunner.query(`DROP TABLE \`USER_STORIES_USUARIOS\``);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` ADD CONSTRAINT \`FK_48311ce7e29574d5cbe2e57de23\` FOREIGN KEY (\`FK_COLABORADOR_COL_CRI_ID\`) REFERENCES \`COLABORADORES\`(\`COL_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES\` ADD CONSTRAINT \`FK_28a13d2b8b6e2907e9f73b0812e\` FOREIGN KEY (\`FK_COLABORADOR_COL_RES_ID\`) REFERENCES \`COLABORADORES\`(\`COL_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
