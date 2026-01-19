import { MigrationInterface, QueryRunner } from "typeorm";

export class UnifyUserTypes1768799631035 implements MigrationInterface {
    name = 'UnifyUserTypes1768799631035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`COLABORADORES_PROJETOS\` (\`COP_ID\` int NOT NULL AUTO_INCREMENT, \`COP_ATIVO\` tinyint NOT NULL, \`COP_ADMINISTRADOR\` tinyint NOT NULL, \`FK_COLABORADORES_COL_ID\` int NULL, \`FK_COLABORADORES_FK_USUARIOS_USU_ID\` int NULL, \`FK_PROJETOS_PRO_ID\` int NULL, PRIMARY KEY (\`COP_ID\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`USUARIOS_PROJETOS\` (\`USP_ID\` int NOT NULL AUTO_INCREMENT, \`USP_ATIVO\` tinyint NOT NULL DEFAULT 1, \`USP_ADMINISTRADOR\` tinyint NOT NULL DEFAULT 0, \`USP_ROLE\` enum ('colaborador', 'stakeholder') NOT NULL DEFAULT 'colaborador', \`FK_USUARIOS_USU_ID\` int NULL, \`FK_PROJETOS_PRO_ID\` int NULL, PRIMARY KEY (\`USP_ID\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`USER_STORIES_COLABORADORES\` (\`uSERSTORIESUSTID\` int NOT NULL, \`cOLABORADORESCOLID\` int NOT NULL, INDEX \`IDX_3500f15e563669a9d11db7fa37\` (\`uSERSTORIESUSTID\`), INDEX \`IDX_848e3adaa61749ce5f87199290\` (\`cOLABORADORESCOLID\`), PRIMARY KEY (\`uSERSTORIESUSTID\`, \`cOLABORADORESCOLID\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`USUARIOS\` ADD \`USU_NOME\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`USUARIOS\` ADD \`USU_EMAIL\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`USUARIOS\` ADD UNIQUE INDEX \`IDX_b5b7357c286f085a9fe5c86e46\` (\`USU_EMAIL\`)`);
        await queryRunner.query(`ALTER TABLE \`USUARIOS\` ADD \`USU_SENHA\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`USUARIOS\` ADD \`USU_EMPRESA\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`USUARIOS\` ADD \`USU_CARGO\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`USUARIOS\` ADD \`USU_TIPO\` enum ('colaborador', 'stakeholder') NOT NULL DEFAULT 'colaborador'`);
        await queryRunner.query(`ALTER TABLE \`SWIMLANES\` CHANGE \`SWI_VERTICAL\` \`SWI_VERTICAL\` tinyint(1) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`SUBTAREFAS\` CHANGE \`SBT_COMPLETADA\` \`SBT_COMPLETADA\` tinyint(1) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`COLABORADORES_PROJETOS\` ADD CONSTRAINT \`FK_a2f3842c6d1e9da85be63795669\` FOREIGN KEY (\`FK_COLABORADORES_COL_ID\`) REFERENCES \`COLABORADORES\`(\`COL_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`COLABORADORES_PROJETOS\` ADD CONSTRAINT \`FK_671bab7ec79797879138366a686\` FOREIGN KEY (\`FK_COLABORADORES_FK_USUARIOS_USU_ID\`) REFERENCES \`USUARIOS\`(\`USU_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`COLABORADORES_PROJETOS\` ADD CONSTRAINT \`FK_21d329dc2438a0d5ce536a3d356\` FOREIGN KEY (\`FK_PROJETOS_PRO_ID\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`USUARIOS_PROJETOS\` ADD CONSTRAINT \`FK_5060734626c7ab2755be84b62b8\` FOREIGN KEY (\`FK_USUARIOS_USU_ID\`) REFERENCES \`USUARIOS\`(\`USU_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`USUARIOS_PROJETOS\` ADD CONSTRAINT \`FK_567dc9ab8cb39d45dea17a0e986\` FOREIGN KEY (\`FK_PROJETOS_PRO_ID\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_COLABORADORES\` ADD CONSTRAINT \`FK_3500f15e563669a9d11db7fa376\` FOREIGN KEY (\`uSERSTORIESUSTID\`) REFERENCES \`USER_STORIES\`(\`UST_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_COLABORADORES\` ADD CONSTRAINT \`FK_848e3adaa61749ce5f871992906\` FOREIGN KEY (\`cOLABORADORESCOLID\`) REFERENCES \`COLABORADORES\`(\`COL_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_COLABORADORES\` DROP FOREIGN KEY \`FK_848e3adaa61749ce5f871992906\``);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_COLABORADORES\` DROP FOREIGN KEY \`FK_3500f15e563669a9d11db7fa376\``);
        await queryRunner.query(`ALTER TABLE \`USUARIOS_PROJETOS\` DROP FOREIGN KEY \`FK_567dc9ab8cb39d45dea17a0e986\``);
        await queryRunner.query(`ALTER TABLE \`USUARIOS_PROJETOS\` DROP FOREIGN KEY \`FK_5060734626c7ab2755be84b62b8\``);
        await queryRunner.query(`ALTER TABLE \`COLABORADORES_PROJETOS\` DROP FOREIGN KEY \`FK_21d329dc2438a0d5ce536a3d356\``);
        await queryRunner.query(`ALTER TABLE \`COLABORADORES_PROJETOS\` DROP FOREIGN KEY \`FK_671bab7ec79797879138366a686\``);
        await queryRunner.query(`ALTER TABLE \`COLABORADORES_PROJETOS\` DROP FOREIGN KEY \`FK_a2f3842c6d1e9da85be63795669\``);
        await queryRunner.query(`ALTER TABLE \`SUBTAREFAS\` CHANGE \`SBT_COMPLETADA\` \`SBT_COMPLETADA\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`SWIMLANES\` CHANGE \`SWI_VERTICAL\` \`SWI_VERTICAL\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`USUARIOS\` DROP COLUMN \`USU_TIPO\``);
        await queryRunner.query(`ALTER TABLE \`USUARIOS\` DROP COLUMN \`USU_CARGO\``);
        await queryRunner.query(`ALTER TABLE \`USUARIOS\` DROP COLUMN \`USU_EMPRESA\``);
        await queryRunner.query(`ALTER TABLE \`USUARIOS\` DROP COLUMN \`USU_SENHA\``);
        await queryRunner.query(`ALTER TABLE \`USUARIOS\` DROP INDEX \`IDX_b5b7357c286f085a9fe5c86e46\``);
        await queryRunner.query(`ALTER TABLE \`USUARIOS\` DROP COLUMN \`USU_EMAIL\``);
        await queryRunner.query(`ALTER TABLE \`USUARIOS\` DROP COLUMN \`USU_NOME\``);
        await queryRunner.query(`DROP INDEX \`IDX_848e3adaa61749ce5f87199290\` ON \`USER_STORIES_COLABORADORES\``);
        await queryRunner.query(`DROP INDEX \`IDX_3500f15e563669a9d11db7fa37\` ON \`USER_STORIES_COLABORADORES\``);
        await queryRunner.query(`DROP TABLE \`USER_STORIES_COLABORADORES\``);
        await queryRunner.query(`DROP TABLE \`USUARIOS_PROJETOS\``);
        await queryRunner.query(`DROP TABLE \`COLABORADORES_PROJETOS\``);
    }

}
