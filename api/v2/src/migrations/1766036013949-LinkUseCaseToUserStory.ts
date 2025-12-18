import { MigrationInterface, QueryRunner } from "typeorm";

export class LinkUseCaseToUserStory1766036013949 implements MigrationInterface {
    name = 'LinkUseCaseToUserStory1766036013949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`USER_STORIES_REQUISITOS\` (\`uSERSTORIESUSTID\` int NOT NULL, \`rEQUISITOSFUNCIONAISREQID\` int NOT NULL, INDEX \`IDX_2e443b823b58b4bf0706ce3e91\` (\`uSERSTORIESUSTID\`), INDEX \`IDX_166a1ce4fba35e70aae376359f\` (\`rEQUISITOSFUNCIONAISREQID\`), PRIMARY KEY (\`uSERSTORIESUSTID\`, \`rEQUISITOSFUNCIONAISREQID\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_REQUISITOS\` ADD CONSTRAINT \`FK_2e443b823b58b4bf0706ce3e91e\` FOREIGN KEY (\`uSERSTORIESUSTID\`) REFERENCES \`USER_STORIES\`(\`UST_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_REQUISITOS\` ADD CONSTRAINT \`FK_166a1ce4fba35e70aae376359f1\` FOREIGN KEY (\`rEQUISITOSFUNCIONAISREQID\`) REFERENCES \`REQUISITOS_FUNCIONAIS\`(\`REQ_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_REQUISITOS\` DROP FOREIGN KEY \`FK_166a1ce4fba35e70aae376359f1\``);
        await queryRunner.query(`ALTER TABLE \`USER_STORIES_REQUISITOS\` DROP FOREIGN KEY \`FK_2e443b823b58b4bf0706ce3e91e\``);
        await queryRunner.query(`DROP INDEX \`IDX_166a1ce4fba35e70aae376359f\` ON \`USER_STORIES_REQUISITOS\``);
        await queryRunner.query(`DROP INDEX \`IDX_2e443b823b58b4bf0706ce3e91\` ON \`USER_STORIES_REQUISITOS\``);
        await queryRunner.query(`DROP TABLE \`USER_STORIES_REQUISITOS\``);
    }

}
