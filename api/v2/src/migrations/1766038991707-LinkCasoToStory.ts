import { MigrationInterface, QueryRunner } from "typeorm";

export class LinkCasoToStory1766038991707 implements MigrationInterface {
    name = 'LinkCasoToStory1766038991707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`USER_STORIES_CASOS_USO\` (\`uSERSTORIESUSTID\` int NOT NULL, \`cASOSDEUSOCASID\` int NOT NULL, INDEX \`IDX_afef0796cd6f216b406e569362\` (\`uSERSTORIESUSTID\`), INDEX \`IDX_272d437f4bd1d551aeeded7da8\` (\`cASOSDEUSOCASID\`), PRIMARY KEY (\`uSERSTORIESUSTID\`, \`cASOSDEUSOCASID\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_CASOS_USO\` ADD CONSTRAINT \`FK_afef0796cd6f216b406e5693629\` FOREIGN KEY (\`uSERSTORIESUSTID\`) REFERENCES \`USER_STORIES\`(\`UST_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_CASOS_USO\` ADD CONSTRAINT \`FK_272d437f4bd1d551aeeded7da81\` FOREIGN KEY (\`cASOSDEUSOCASID\`) REFERENCES \`CASOS_DE_USO\`(\`CAS_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_CASOS_USO\` DROP FOREIGN KEY \`FK_272d437f4bd1d551aeeded7da81\``);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_CASOS_USO\` DROP FOREIGN KEY \`FK_afef0796cd6f216b406e5693629\``);
        await queryRunner.query(`DROP INDEX \`IDX_272d437f4bd1d551aeeded7da8\` ON \`USER_STORIES_CASOS_USO\``);
        await queryRunner.query(`DROP INDEX \`IDX_afef0796cd6f216b406e569362\` ON \`USER_STORIES_CASOS_USO\``);
        await queryRunner.query(`DROP TABLE \`USER_STORIES_CASOS_USO\``);
    }

}
