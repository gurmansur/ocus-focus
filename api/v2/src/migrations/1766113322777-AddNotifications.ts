import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotifications1766113322777 implements MigrationInterface {
  name = 'AddNotifications1766113322777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`NOTIFICACOES\` (\`NTF_ID\` int NOT NULL AUTO_INCREMENT, \`NTF_MENSAGEM\` varchar(255) NOT NULL, \`NTF_LIDO\` tinyint NOT NULL DEFAULT '0', \`NTF_CRIADO_EM\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`FK_DESTINATARIO_USUARIO_ID\` int NULL, \`FK_REMETENTE_USUARIO_ID\` int NULL, \`FK_USER_STORY\` int NULL, \`FK_COMENTARIO\` int NULL, PRIMARY KEY (\`NTF_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`NOTIFICACOES\` ADD CONSTRAINT \`FK_642d786872565727dab940db73e\` FOREIGN KEY (\`FK_DESTINATARIO_USUARIO_ID\`) REFERENCES \`USUARIOS\`(\`USU_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`NOTIFICACOES\` ADD CONSTRAINT \`FK_26cd79afda4520bec237e087870\` FOREIGN KEY (\`FK_REMETENTE_USUARIO_ID\`) REFERENCES \`USUARIOS\`(\`USU_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`NOTIFICACOES\` ADD CONSTRAINT \`FK_8a231b70354ac2acc0e43fb41c7\` FOREIGN KEY (\`FK_USER_STORY\`) REFERENCES \`USER_STORIES\`(\`UST_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`NOTIFICACOES\` ADD CONSTRAINT \`FK_4f7d77d53ee1ab76304349fc33c\` FOREIGN KEY (\`FK_COMENTARIO\`) REFERENCES \`COMENTARIOS\`(\`CMN_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`NOTIFICACOES\` DROP FOREIGN KEY \`FK_4f7d77d53ee1ab76304349fc33c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`NOTIFICACOES\` DROP FOREIGN KEY \`FK_8a231b70354ac2acc0e43fb41c7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`NOTIFICACOES\` DROP FOREIGN KEY \`FK_26cd79afda4520bec237e087870\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`NOTIFICACOES\` DROP FOREIGN KEY \`FK_642d786872565727dab940db73e\``,
    );
    await queryRunner.query(`DROP TABLE \`NOTIFICACOES\``);
  }
}
