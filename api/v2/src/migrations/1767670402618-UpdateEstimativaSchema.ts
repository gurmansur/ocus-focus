import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEstimativaSchema1767670402618 implements MigrationInterface {
    name = 'UpdateEstimativaSchema1767670402618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP FOREIGN KEY \`FK_d8a1435775f634e45757fecc3d5\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`projetoId\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_NOME\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_DESCRICAO\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_USE_CASE_WEIGHTS\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_ACTOR_WEIGHTS\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_TECHNICAL_FACTORS\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_ENVIRONMENTAL_FACTORS\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_UUCW\` double(8,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_UAW\` double(8,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_UUCP\` double(8,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_TCF\` double(6,3) NOT NULL DEFAULT '0.600'`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_EF\` double(6,3) NOT NULL DEFAULT '1.400'`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_UCP\` double(8,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_HOURS_PER_UCP\` double(6,2) NOT NULL DEFAULT '20.00'`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_ESTIMATED_HOURS\` double(8,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_ESTIMATED_DAYS\` double(8,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_STATUS\` enum ('draft', 'in-progress', 'completed') NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_CREATED_AT\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_UPDATED_AT\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_TFACTOR_LEGACY\` double(6,3) NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`EST_EFACTOR_LEGACY\` double(6,3) NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`FK_PROJETOS_PRO_ID\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`FK_COLABORADORES_COL_ID\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_TFACTOR\` \`EST_TFACTOR\` double(6,3) NOT NULL DEFAULT '0.000'`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_EFACTOR\` \`EST_EFACTOR\` double(6,3) NOT NULL DEFAULT '0.000'`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_RESULTADO_HORAS\` \`EST_RESULTADO_HORAS\` double(8,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_PESO_ATORES\` \`EST_PESO_ATORES\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_PESO_CASOS_USO\` \`EST_PESO_CASOS_USO\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_PESO_PONTOS_CASOS_USO\` \`EST_PESO_PONTOS_CASOS_USO\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_RESULTADO_PONTOS_CASOS_USO\` \`EST_RESULTADO_PONTOS_CASOS_USO\` double(6,3) NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_DATA_ESTIMATIVA\` \`EST_DATA_ESTIMATIVA\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`SWIMLANES\` CHANGE \`SWI_VERTICAL\` \`SWI_VERTICAL\` tinyint(1) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`SUBTAREFAS\` CHANGE \`SBT_COMPLETADA\` \`SBT_COMPLETADA\` tinyint(1) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD CONSTRAINT \`FK_db346308d640b1e41b3357a9713\` FOREIGN KEY (\`FK_PROJETOS_PRO_ID\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD CONSTRAINT \`FK_2e797f4798e9484066194623f87\` FOREIGN KEY (\`FK_COLABORADORES_COL_ID\`) REFERENCES \`COLABORADORES\`(\`COL_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP FOREIGN KEY \`FK_2e797f4798e9484066194623f87\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP FOREIGN KEY \`FK_db346308d640b1e41b3357a9713\``);
        await queryRunner.query(`ALTER TABLE \`SUBTAREFAS\` CHANGE \`SBT_COMPLETADA\` \`SBT_COMPLETADA\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`SWIMLANES\` CHANGE \`SWI_VERTICAL\` \`SWI_VERTICAL\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_DATA_ESTIMATIVA\` \`EST_DATA_ESTIMATIVA\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_RESULTADO_PONTOS_CASOS_USO\` \`EST_RESULTADO_PONTOS_CASOS_USO\` double(6,3) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_PESO_PONTOS_CASOS_USO\` \`EST_PESO_PONTOS_CASOS_USO\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_PESO_CASOS_USO\` \`EST_PESO_CASOS_USO\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_PESO_ATORES\` \`EST_PESO_ATORES\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_RESULTADO_HORAS\` \`EST_RESULTADO_HORAS\` double(8,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_EFACTOR\` \`EST_EFACTOR\` double(6,3) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` CHANGE \`EST_TFACTOR\` \`EST_TFACTOR\` double(6,3) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`FK_COLABORADORES_COL_ID\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`FK_PROJETOS_PRO_ID\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_EFACTOR_LEGACY\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_TFACTOR_LEGACY\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_UPDATED_AT\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_CREATED_AT\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_STATUS\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_ESTIMATED_DAYS\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_ESTIMATED_HOURS\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_HOURS_PER_UCP\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_UCP\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_EF\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_TCF\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_UUCP\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_UAW\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_UUCW\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_ENVIRONMENTAL_FACTORS\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_TECHNICAL_FACTORS\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_ACTOR_WEIGHTS\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_USE_CASE_WEIGHTS\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_DESCRICAO\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP COLUMN \`EST_NOME\``);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD \`projetoId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD CONSTRAINT \`FK_d8a1435775f634e45757fecc3d5\` FOREIGN KEY (\`projetoId\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
