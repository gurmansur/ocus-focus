import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1733805538293 implements MigrationInterface {
  name = 'InitialMigration1733805538293';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`ARQUIVOS\` (\`arq_id\` int NOT NULL AUTO_INCREMENT, \`arq_arquivo\` mediumblob NOT NULL, PRIMARY KEY (\`arq_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`CENARIOS\` (\`CEN_ID\` int NOT NULL AUTO_INCREMENT, \`CEN_NOME\` varchar(50) NOT NULL, \`CEN_DESCRICAO\` varchar(255) NOT NULL, \`CEN_TIPO\` enum ('PRINCIPAL', 'ALTERNATIVO') NOT NULL DEFAULT 'PRINCIPAL', \`FK_CASOS_DE_USO_CAS_ID\` int NULL, PRIMARY KEY (\`CEN_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`ATORES\` (\`ATO_ID\` int NOT NULL AUTO_INCREMENT, \`ATO_NOME\` varchar(30) NOT NULL, \`ATO_COMPLEXIDADE\` enum ('SIMPLES', 'MEDIO', 'COMPLEXO') NOT NULL DEFAULT 'SIMPLES', \`ATO_DESCRICAO\` varchar(255) NOT NULL, \`FK_PROJETOS_PRO_ID\` int NULL, PRIMARY KEY (\`ATO_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`STATUS_PRIORIZACAO\` (\`SPA_ID\` int NOT NULL AUTO_INCREMENT, \`SPA_PARTICIPACAO_REALIZADA\` tinyint NOT NULL DEFAULT 0, \`SPA_ALERTA_EMITIDO\` tinyint NOT NULL DEFAULT 0, \`FK_STAKEHOLDERS_STA_ID\` int NULL, \`FK_STAKEHOLDERS_FK_USUARIOS_USU_ID\` int NULL, PRIMARY KEY (\`SPA_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`USUARIOS\` (\`USU_ID\` int NOT NULL AUTO_INCREMENT, \`USU_DATA_CADASTRO\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`USU_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`COLABORADORES_PROJETOS\` (\`COP_ID\` int NOT NULL AUTO_INCREMENT, \`COP_ATIVO\` tinyint NOT NULL, \`COP_ADMINISTRADOR\` tinyint NOT NULL, \`FK_COLABORADORES_COL_ID\` int NULL, \`FK_COLABORADORES_FK_USUARIOS_USU_ID\` int NULL, \`FK_PROJETOS_PRO_ID\` int NULL, PRIMARY KEY (\`COP_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`ESTIMATIVAS_ESFORCOS\` (\`EST_ID\` int NOT NULL AUTO_INCREMENT, \`EST_RESULTADO_HORAS\` double(8,2) NOT NULL, \`EST_PESO_ATORES\` int NOT NULL, \`EST_PESO_CASOS_USO\` int NOT NULL, \`EST_PESO_PONTOS_CASOS_USO\` int NOT NULL, \`EST_TFACTOR\` double(6,3) NOT NULL, \`EST_EFACTOR\` double(6,3) NOT NULL, \`EST_RESULTADO_PONTOS_CASOS_USO\` double(6,3) NOT NULL, \`EST_DATA_ESTIMATIVA\` varchar(20) NOT NULL, \`projetoId\` int NULL, PRIMARY KEY (\`EST_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`FATORES_AMBIENTAIS\` (\`AMB_ID\` int NOT NULL AUTO_INCREMENT, \`AMB_DESCRICAO\` varchar(255) NOT NULL, \`AMB_PESO\` double(4,2) NOT NULL, PRIMARY KEY (\`AMB_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`FATORES_AMBIENTAIS_PROJETOS\` (\`AMP_ID\` int NOT NULL AUTO_INCREMENT, \`AMP_VALOR\` int NOT NULL, \`FK_PROJETOS_PRO_ID\` int NULL, \`FK_FATORES_AMBIENTAIS_AMB_ID\` int NULL, PRIMARY KEY (\`AMP_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`FATORES_TECNICOS\` (\`TEC_ID\` int NOT NULL AUTO_INCREMENT, \`TEC_DESCRICAO\` varchar(50) NOT NULL, \`TEC_PESO\` double(4,2) NOT NULL, PRIMARY KEY (\`TEC_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`FATORES_TECNICOS_PROJETOS\` (\`TEP_ID\` int NOT NULL AUTO_INCREMENT, \`TEP_VALOR\` int NOT NULL, \`FK_PROJETOS_PRO_ID\` int NULL, \`FK_FATORES_TECNICOS_TEC_ID\` int NULL, PRIMARY KEY (\`TEP_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`SPRINTS\` (\`SPR_ID\` int NOT NULL AUTO_INCREMENT, \`SPR_NOME\` varchar(30) NOT NULL, \`SPR_DESCRICAO\` varchar(255) NOT NULL, \`SPR_HORAS_PREVISTAS\` int NOT NULL, \`SPR_DATA_INICIO\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`SPR_DATA_FIM\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`SPR_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`SUITES_DE_TESTE\` (\`id\` int NOT NULL AUTO_INCREMENT, \`SDT_NOME\` varchar(50) NOT NULL, \`SDT_STATUS\` enum ('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO', \`SDT_DESCRICAO\` varchar(255) NOT NULL, \`SDT_OBSERVACOES\` varchar(255) NOT NULL, \`SDT_DATA_CRIACAO\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`SDT_DATA_ATUALIZACAO\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`SDT_DATA_EXCLUSAO\` datetime(6) NULL, \`FK_SUITE_DE_TESTE_SDT_ID\` int NULL, \`FK_PROJETO_PRO_ID\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`PROJETOS\` (\`PRO_ID\` int NOT NULL AUTO_INCREMENT, \`PRO_NOME\` varchar(100) NOT NULL, \`PRO_DESCRICAO\` varchar(255) NOT NULL, \`PRO_EMPRESA\` varchar(50) NOT NULL, \`PRO_DATA_INICIO\` date NOT NULL, \`PRO_PREVISAO_FIM\` date NOT NULL, \`PRO_STATUS\` enum ('EM ANDAMENTO', 'FINALIZADO', 'CANCELADO') NOT NULL DEFAULT 'EM ANDAMENTO', \`PRO_RESTFACTOR\` double(4,2) NULL, \`PRO_RESEFACTOR\` double(4,2) NULL, PRIMARY KEY (\`PRO_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`STAKEHOLDERS\` (\`STA_ID\` int NOT NULL AUTO_INCREMENT, \`STA_CHAVE\` varchar(100) NOT NULL, \`STA_SENHA\` varchar(100) NOT NULL, \`STA_NOME\` varchar(100) NOT NULL, \`STA_CARGO\` varchar(50) NOT NULL, \`STA_EMAIL\` varchar(255) NOT NULL, \`FK_USUARIOS_USU_ID\` int NULL, \`FK_PROJETOS_PRO_ID\` int NULL, PRIMARY KEY (\`STA_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`PRIORIZACAO_STAKEHOLDERS\` (\`PRS_ID\` int NOT NULL AUTO_INCREMENT, \`PRS_CLASSIFICACAO_REQUISITO\` enum ('DEVE SER FEITO', 'PERFORMANCE', 'ATRATIVO', 'INDIFERENTE', 'QUESTIONAVEL', 'REVERSO') NOT NULL, \`PRS_RESPOSTA_POSITIVA\` enum ('GOSTARIA', 'ESPERADO', 'NAO IMPORTA', 'CONVIVO COM ISSO', 'NAO GOSTARIA') NOT NULL, \`PRS_RESPOSTA_NEGATIVA\` enum ('GOSTARIA', 'ESPERADO', 'NAO IMPORTA', 'CONVIVO COM ISSO', 'NAO GOSTARIA') NOT NULL, \`FK_STAKEHOLDERS_STA_ID\` int NULL, \`FK_STAKEHOLDERS_FK_USUARIOS_USU_ID\` int NULL, \`FK_REQUISITOS_FUNCIONAIS_REQ_ID\` int NULL, PRIMARY KEY (\`PRS_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`RESULTADO_REQUISITOS\` (\`RPR_ID\` int NOT NULL AUTO_INCREMENT, \`RPR_RESULTADO_FINAL\` enum ('DEVE SER FEITO', 'PERFORMANCE', 'ATRATIVO', 'INDIFERENTE', 'QUESTIONAVEL', 'REVERSO') NOT NULL, \`FK_REQUISITOS_FUNCIONAIS_REQ_ID\` int NULL, PRIMARY KEY (\`RPR_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`REQUISITOS_FUNCIONAIS\` (\`REQ_ID\` int NOT NULL AUTO_INCREMENT, \`REQ_ESPECIFICACAO\` varchar(1000) NOT NULL, \`REQ_NOME\` varchar(100) NOT NULL, \`REQ_NUMERO_IDENTIFICADOR\` int NOT NULL, \`FK_PROJETOS_PRO_ID\` int NULL, PRIMARY KEY (\`REQ_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`CASOS_DE_USO\` (\`CAS_ID\` int NOT NULL AUTO_INCREMENT, \`CAS_NOME\` varchar(50) NOT NULL, \`CAS_DESCRICAO\` varchar(255) NOT NULL, \`CAS_COMPLEXIDADE\` enum ('SIMPLES', 'MEDIO', 'COMPLEXO') NOT NULL DEFAULT 'SIMPLES', \`FK_REQUISITOS_FUNCIONAIS_REQ_ID\` int NULL, PRIMARY KEY (\`CAS_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`EXECUCOES_DE_TESTE\` (\`EDT_ID\` int NOT NULL AUTO_INCREMENT, \`EDT_NOME\` varchar(50) NOT NULL, \`EDT_DATA_EXECUCAO\` timestamp NOT NULL, \`EDT_RESPOSTA\` varchar(255) NULL, \`EDT_RESULTADO\` enum ('SUCESSO', 'FALHA', 'PENDENTE') NOT NULL DEFAULT 'PENDENTE', \`EDT_OBSERVACAO\` varchar(255) NULL, \`EDT_METODO\` enum ('MANUAL', 'AUTOMATIZADO') NOT NULL DEFAULT 'MANUAL', \`EDT_DATA_CRIACAO\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`EDT_DATA_ATUALIZACAO\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`EDT_DATA_EXCLUSAO\` datetime(6) NULL, \`FK_CASO_DE_TESTE_CDT_ID\` int NULL, PRIMARY KEY (\`EDT_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`CASOS_DE_TESTE\` (\`CDT_ID\` int NOT NULL AUTO_INCREMENT, \`CDT_NOME\` varchar(50) NOT NULL, \`CDT_STATUS\` enum ('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO', \`CDT_METODO\` enum ('MANUAL', 'AUTOMATIZADO') NOT NULL DEFAULT 'MANUAL', \`CDT_TECNICA\` enum ('FUNCIONAL', 'ESTRUTURAL') NOT NULL DEFAULT 'FUNCIONAL', \`CDT_PRIORIDADE\` enum ('ALTA', 'MEDIA', 'BAIXA') NOT NULL DEFAULT 'MEDIA', \`CDT_COMPLEXIDADE\` enum ('SIMPLES', 'MEDIO', 'COMPLEXO') NOT NULL DEFAULT 'SIMPLES', \`CDT_DESCRICAO\` varchar(255) NOT NULL, \`CDT_OBSERVACOES\` varchar(255) NOT NULL, \`CDT_PRE_CONDICAO\` varchar(255) NOT NULL, \`CDT_POS_CONDICAO\` varchar(255) NOT NULL, \`CDT_DADOS_ENTRADA\` text NOT NULL, \`CDT_RESULTADO_ESPERADO\` text NOT NULL, \`CDT_DATA_CRIACAO\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`CDT_DATA_ATUALIZACAO\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`CDT_DATA_EXCLUSAO\` datetime(6) NULL, \`FK_CASOS_DE_USO_CAS_ID\` int NULL, \`FK_SUITE_DE_TESTE_SDT_ID\` int NULL, \`FK_COLABORADORES_COL_ID\` int NULL, \`FK_PROJETO_PRO_ID\` int NULL, PRIMARY KEY (\`CDT_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`COMENTARIOS\` (\`cmn_id\` int NOT NULL AUTO_INCREMENT, \`cmn_comentario\` varchar(255) NOT NULL, \`cmn_criado_em\` datetime NOT NULL, \`cmn_modificado_em\` datetime NOT NULL, \`fk_usuario_id\` int NULL, \`fk_user_story\` int NULL, PRIMARY KEY (\`cmn_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`COLABORADORES\` (\`COL_ID\` int NOT NULL AUTO_INCREMENT, \`COL_NOME\` varchar(100) NOT NULL, \`COL_EMAIL\` varchar(255) NOT NULL, \`COL_SENHA\` varchar(100) NOT NULL, \`COL_EMPRESA\` varchar(30) NOT NULL, \`COL_CARGO\` enum ('Gerente de Projeto', 'Analista de Sistemas', 'Desenvolvedor', 'Product Owner', 'Scrum Master') NOT NULL DEFAULT 'Desenvolvedor', \`FK_USUARIOS_USU_ID\` int NULL, PRIMARY KEY (\`COL_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`SWIMLANES\` (\`SWI_ID\` int NOT NULL AUTO_INCREMENT, \`SWI_NOME\` varchar(30) NOT NULL, \`SWI_VERTICAL\` tinyint(1) NOT NULL DEFAULT '0', \`SWI_COR\` varchar(7) NOT NULL, \`SWI_CRIADO_EM\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`SWI_ATUALIZADO_EM\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`FK_KAN_ID\` int NULL, PRIMARY KEY (\`SWI_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`KANBANS\` (\`KAN_ID\` int NOT NULL AUTO_INCREMENT, \`FK_PRO_ID\` int NULL, UNIQUE INDEX \`REL_7b35d1df7f716ff30c825ce989\` (\`FK_PRO_ID\`), PRIMARY KEY (\`KAN_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`SUBTAREFAS\` (\`SBT_ID\` int NOT NULL AUTO_INCREMENT, \`SBT_DESCRICAO\` varchar(255) NOT NULL, \`SBT_COMPLETADA\` tinyint(1) NOT NULL, \`FK_USER_STORY\` int NULL, PRIMARY KEY (\`SBT_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`TAGS\` (\`tag_id\` int NOT NULL AUTO_INCREMENT, \`tag_nome\` varchar(20) NOT NULL, \`tag_cor\` varchar(6) NOT NULL, PRIMARY KEY (\`tag_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`USER_STORIES\` (\`UST_ID\` int NOT NULL AUTO_INCREMENT, \`UST_TITULO\` varchar(50) NOT NULL, \`UST_DESCRICAO\` varchar(255) NOT NULL, \`UST_ESTIMATIVA_TEMPO\` int NOT NULL, \`UST_CRIADO_EM\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`UST_MODIFICADO_EM\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`FK_COLABORADOR_COL_CRI_ID\` int NULL, \`FK_COLABORADOR_COL_RES_ID\` int NULL, \`FK_KANBAN_ID\` int NULL, \`FK_PRO_ID\` int NULL, \`FK_SWI_ID\` int NULL, PRIMARY KEY (\`UST_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`USER_STORY_ARQUIVOS\` (\`uSERSTORIESUSTID\` int NOT NULL, \`aRQUIVOSArqId\` int NOT NULL, INDEX \`IDX_17071da5d078578dc872197749\` (\`uSERSTORIESUSTID\`), INDEX \`IDX_f8a81b2401c309e707d8762768\` (\`aRQUIVOSArqId\`), PRIMARY KEY (\`uSERSTORIESUSTID\`, \`aRQUIVOSArqId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`USER_STORIES_COLABORADORES\` (\`uSERSTORIESUSTID\` int NOT NULL, \`cOLABORADORESCOLID\` int NOT NULL, INDEX \`IDX_3500f15e563669a9d11db7fa37\` (\`uSERSTORIESUSTID\`), INDEX \`IDX_848e3adaa61749ce5f87199290\` (\`cOLABORADORESCOLID\`), PRIMARY KEY (\`uSERSTORIESUSTID\`, \`cOLABORADORESCOLID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`SPRINTS_USERS_STORIES\` (\`uSERSTORIESUSTID\` int NOT NULL, \`sPRINTSSPRID\` int NOT NULL, INDEX \`IDX_a914f1497fdc7f03ac8a40af0a\` (\`uSERSTORIESUSTID\`), INDEX \`IDX_b878609198e33979b5cab65169\` (\`sPRINTSSPRID\`), PRIMARY KEY (\`uSERSTORIESUSTID\`, \`sPRINTSSPRID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`SUITES_DE_TESTE_RELATION_closure\` (\`id_ancestor\` int NOT NULL, \`id_descendant\` int NOT NULL, INDEX \`IDX_7a69302bc35bf787fd17ea067f\` (\`id_ancestor\`), INDEX \`IDX_0a663735b1c11c6dfa3ead92b9\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`CENARIOS\` ADD CONSTRAINT \`FK_a680e32f58a0d62135d90ec600b\` FOREIGN KEY (\`FK_CASOS_DE_USO_CAS_ID\`) REFERENCES \`CASOS_DE_USO\`(\`CAS_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ATORES\` ADD CONSTRAINT \`FK_b3ddc2a92caa7c6d1386a1c378b\` FOREIGN KEY (\`FK_PROJETOS_PRO_ID\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`STATUS_PRIORIZACAO\` ADD CONSTRAINT \`FK_4e3922310803560cba80659f279\` FOREIGN KEY (\`FK_STAKEHOLDERS_STA_ID\`) REFERENCES \`STAKEHOLDERS\`(\`STA_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`STATUS_PRIORIZACAO\` ADD CONSTRAINT \`FK_fb7231b4eb38ac98b4be32c3c7b\` FOREIGN KEY (\`FK_STAKEHOLDERS_FK_USUARIOS_USU_ID\`) REFERENCES \`USUARIOS\`(\`USU_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`COLABORADORES_PROJETOS\` ADD CONSTRAINT \`FK_a2f3842c6d1e9da85be63795669\` FOREIGN KEY (\`FK_COLABORADORES_COL_ID\`) REFERENCES \`COLABORADORES\`(\`COL_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`COLABORADORES_PROJETOS\` ADD CONSTRAINT \`FK_671bab7ec79797879138366a686\` FOREIGN KEY (\`FK_COLABORADORES_FK_USUARIOS_USU_ID\`) REFERENCES \`USUARIOS\`(\`USU_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`COLABORADORES_PROJETOS\` ADD CONSTRAINT \`FK_21d329dc2438a0d5ce536a3d356\` FOREIGN KEY (\`FK_PROJETOS_PRO_ID\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` ADD CONSTRAINT \`FK_d8a1435775f634e45757fecc3d5\` FOREIGN KEY (\`projetoId\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`FATORES_AMBIENTAIS_PROJETOS\` ADD CONSTRAINT \`FK_33547206e5e9d4aeebbe967b604\` FOREIGN KEY (\`FK_PROJETOS_PRO_ID\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`FATORES_AMBIENTAIS_PROJETOS\` ADD CONSTRAINT \`FK_831bb9a8ab96127713017b69a29\` FOREIGN KEY (\`FK_FATORES_AMBIENTAIS_AMB_ID\`) REFERENCES \`FATORES_AMBIENTAIS\`(\`AMB_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`FATORES_TECNICOS_PROJETOS\` ADD CONSTRAINT \`FK_41f07677e6f8179942791b2c299\` FOREIGN KEY (\`FK_PROJETOS_PRO_ID\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`FATORES_TECNICOS_PROJETOS\` ADD CONSTRAINT \`FK_6f81ec50a173807e18b6c813777\` FOREIGN KEY (\`FK_FATORES_TECNICOS_TEC_ID\`) REFERENCES \`FATORES_TECNICOS\`(\`TEC_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`SUITES_DE_TESTE\` ADD CONSTRAINT \`FK_9cbcd836fc4f159ac7e7ca68137\` FOREIGN KEY (\`FK_SUITE_DE_TESTE_SDT_ID\`) REFERENCES \`SUITES_DE_TESTE\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`SUITES_DE_TESTE\` ADD CONSTRAINT \`FK_b6277b122d6885971d6dfd0ad95\` FOREIGN KEY (\`FK_PROJETO_PRO_ID\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`STAKEHOLDERS\` ADD CONSTRAINT \`FK_3733a295e8f3c4e6f23f3babc2e\` FOREIGN KEY (\`FK_USUARIOS_USU_ID\`) REFERENCES \`USUARIOS\`(\`USU_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`STAKEHOLDERS\` ADD CONSTRAINT \`FK_62bc9443115b976b578b5e37dc0\` FOREIGN KEY (\`FK_PROJETOS_PRO_ID\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`PRIORIZACAO_STAKEHOLDERS\` ADD CONSTRAINT \`FK_2672110843a47157079202a5cf7\` FOREIGN KEY (\`FK_STAKEHOLDERS_STA_ID\`) REFERENCES \`STAKEHOLDERS\`(\`STA_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`PRIORIZACAO_STAKEHOLDERS\` ADD CONSTRAINT \`FK_18c191a2937d73b149eb6f86597\` FOREIGN KEY (\`FK_STAKEHOLDERS_FK_USUARIOS_USU_ID\`) REFERENCES \`USUARIOS\`(\`USU_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`PRIORIZACAO_STAKEHOLDERS\` ADD CONSTRAINT \`FK_26f5cba11cc26d82765cc57eafe\` FOREIGN KEY (\`FK_REQUISITOS_FUNCIONAIS_REQ_ID\`) REFERENCES \`REQUISITOS_FUNCIONAIS\`(\`REQ_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`RESULTADO_REQUISITOS\` ADD CONSTRAINT \`FK_8b08cf83ffd1e3f815c8b45b6fe\` FOREIGN KEY (\`FK_REQUISITOS_FUNCIONAIS_REQ_ID\`) REFERENCES \`REQUISITOS_FUNCIONAIS\`(\`REQ_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`REQUISITOS_FUNCIONAIS\` ADD CONSTRAINT \`FK_1670334e6cb5e4a12ae45517cc7\` FOREIGN KEY (\`FK_PROJETOS_PRO_ID\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`CASOS_DE_USO\` ADD CONSTRAINT \`FK_0ecbaa9a062f7a4fbfdd15c9902\` FOREIGN KEY (\`FK_REQUISITOS_FUNCIONAIS_REQ_ID\`) REFERENCES \`REQUISITOS_FUNCIONAIS\`(\`REQ_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`EXECUCOES_DE_TESTE\` ADD CONSTRAINT \`FK_8814cae507f613801943e0d7f6c\` FOREIGN KEY (\`FK_CASO_DE_TESTE_CDT_ID\`) REFERENCES \`CASOS_DE_TESTE\`(\`CDT_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`CASOS_DE_TESTE\` ADD CONSTRAINT \`FK_b4366658430072a75e6767ec866\` FOREIGN KEY (\`FK_CASOS_DE_USO_CAS_ID\`) REFERENCES \`CASOS_DE_USO\`(\`CAS_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`CASOS_DE_TESTE\` ADD CONSTRAINT \`FK_bb77d73b65984173fdad8081ea8\` FOREIGN KEY (\`FK_SUITE_DE_TESTE_SDT_ID\`) REFERENCES \`SUITES_DE_TESTE\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`CASOS_DE_TESTE\` ADD CONSTRAINT \`FK_c605514b9a8b8c7d1f0368ab195\` FOREIGN KEY (\`FK_COLABORADORES_COL_ID\`) REFERENCES \`COLABORADORES\`(\`COL_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`CASOS_DE_TESTE\` ADD CONSTRAINT \`FK_a4806d23a33189c705eec34ffac\` FOREIGN KEY (\`FK_PROJETO_PRO_ID\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`COMENTARIOS\` ADD CONSTRAINT \`FK_344f8118376d5a82e4ecb4d4923\` FOREIGN KEY (\`fk_usuario_id\`) REFERENCES \`USUARIOS\`(\`USU_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`COMENTARIOS\` ADD CONSTRAINT \`FK_1b34f167eb645f5ed4c44d9444e\` FOREIGN KEY (\`fk_user_story\`) REFERENCES \`USER_STORIES\`(\`UST_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`COLABORADORES\` ADD CONSTRAINT \`FK_65a1f543ddc8b9a47b0e403caa6\` FOREIGN KEY (\`FK_USUARIOS_USU_ID\`) REFERENCES \`USUARIOS\`(\`USU_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`SWIMLANES\` ADD CONSTRAINT \`FK_58aaf08431b217dc3845c78da5f\` FOREIGN KEY (\`FK_KAN_ID\`) REFERENCES \`KANBANS\`(\`KAN_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`KANBANS\` ADD CONSTRAINT \`FK_7b35d1df7f716ff30c825ce9897\` FOREIGN KEY (\`FK_PRO_ID\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`SUBTAREFAS\` ADD CONSTRAINT \`FK_b4640da6feb4e19effbf3e6df9e\` FOREIGN KEY (\`FK_USER_STORY\`) REFERENCES \`USER_STORIES\`(\`UST_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORIES\` ADD CONSTRAINT \`FK_48311ce7e29574d5cbe2e57de23\` FOREIGN KEY (\`FK_COLABORADOR_COL_CRI_ID\`) REFERENCES \`COLABORADORES\`(\`COL_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORIES\` ADD CONSTRAINT \`FK_28a13d2b8b6e2907e9f73b0812e\` FOREIGN KEY (\`FK_COLABORADOR_COL_RES_ID\`) REFERENCES \`COLABORADORES\`(\`COL_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORIES\` ADD CONSTRAINT \`FK_6108264ac009132260079873f8c\` FOREIGN KEY (\`FK_KANBAN_ID\`) REFERENCES \`KANBANS\`(\`KAN_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORIES\` ADD CONSTRAINT \`FK_009516f3b82af76b34016a8af11\` FOREIGN KEY (\`FK_PRO_ID\`) REFERENCES \`PROJETOS\`(\`PRO_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORIES\` ADD CONSTRAINT \`FK_f67d042a43ca9187f6ffbba1bbd\` FOREIGN KEY (\`FK_SWI_ID\`) REFERENCES \`SWIMLANES\`(\`SWI_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORY_ARQUIVOS\` ADD CONSTRAINT \`FK_17071da5d078578dc872197749c\` FOREIGN KEY (\`uSERSTORIESUSTID\`) REFERENCES \`USER_STORIES\`(\`UST_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORY_ARQUIVOS\` ADD CONSTRAINT \`FK_f8a81b2401c309e707d8762768e\` FOREIGN KEY (\`aRQUIVOSArqId\`) REFERENCES \`ARQUIVOS\`(\`arq_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORIES_COLABORADORES\` ADD CONSTRAINT \`FK_3500f15e563669a9d11db7fa376\` FOREIGN KEY (\`uSERSTORIESUSTID\`) REFERENCES \`USER_STORIES\`(\`UST_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORIES_COLABORADORES\` ADD CONSTRAINT \`FK_848e3adaa61749ce5f871992906\` FOREIGN KEY (\`cOLABORADORESCOLID\`) REFERENCES \`COLABORADORES\`(\`COL_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`SPRINTS_USERS_STORIES\` ADD CONSTRAINT \`FK_a914f1497fdc7f03ac8a40af0a1\` FOREIGN KEY (\`uSERSTORIESUSTID\`) REFERENCES \`USER_STORIES\`(\`UST_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`SPRINTS_USERS_STORIES\` ADD CONSTRAINT \`FK_b878609198e33979b5cab651694\` FOREIGN KEY (\`sPRINTSSPRID\`) REFERENCES \`SPRINTS\`(\`SPR_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`SUITES_DE_TESTE_RELATION_closure\` ADD CONSTRAINT \`FK_7a69302bc35bf787fd17ea067f9\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`SUITES_DE_TESTE\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`SUITES_DE_TESTE_RELATION_closure\` ADD CONSTRAINT \`FK_0a663735b1c11c6dfa3ead92b9d\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`SUITES_DE_TESTE\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_AMBIENTAIS\` (\`AMB_ID\`,\`AMB_DESCRICAO\`, \`AMB_PESO\`) VALUES ('1','Familiaridade com o processo unificado', '1.5')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_AMBIENTAIS\` (\`AMB_ID\`,\`AMB_DESCRICAO\`, \`AMB_PESO\`) VALUES ('2','Experiência aplicação', '0.5')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_AMBIENTAIS\` (\`AMB_ID\`,\`AMB_DESCRICAO\`, \`AMB_PESO\`) VALUES ('3','Experiência com orientação a objetos', '1.0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_AMBIENTAIS\` (\`AMB_ID\`,\`AMB_DESCRICAO\`, \`AMB_PESO\`) VALUES ('4','Capacidade de análise do líder de projeto', '0.5')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_AMBIENTAIS\` (\`AMB_ID\`,\`AMB_DESCRICAO\`, \`AMB_PESO\`) VALUES ('5','Motivação', '1.0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_AMBIENTAIS\` (\`AMB_ID\`,\`AMB_DESCRICAO\`, \`AMB_PESO\`) VALUES ('6','Estabilidade dos requisitos', '2.0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_AMBIENTAIS\` (\`AMB_ID\`,\`AMB_DESCRICAO\`, \`AMB_PESO\`) VALUES ('7','Consultores em tempo parcial', '-1.0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_AMBIENTAIS\` (\`AMB_ID\`,\`AMB_DESCRICAO\`, \`AMB_PESO\`) VALUES ('8','Dificuldade de programação na Linguagem', '-1.0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_TECNICOS\` (\`TEC_ID\`,\`TEC_DESCRICAO\`, \`TEC_PESO\`) VALUES ('1','Sistema distribuído', '2.0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_TECNICOS\` (\`TEC_ID\`,\`TEC_DESCRICAO\`, \`TEC_PESO\`) VALUES ('2','Desempenho da Aplicação', '1.0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_TECNICOS\` (\`TEC_ID\`,\`TEC_DESCRICAO\`, \`TEC_PESO\`) VALUES ('3','Eficiência do Usuário', '1.0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_TECNICOS\` (\`TEC_ID\`,\`TEC_DESCRICAO\`, \`TEC_PESO\`) VALUES ('4','Complexidade de Processamento', '1.0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_TECNICOS\` (\`TEC_ID\`,\`TEC_DESCRICAO\`, \`TEC_PESO\`) VALUES ('5','Reusabilidade de Código', '1.0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_TECNICOS\` (\`TEC_ID\`,\`TEC_DESCRICAO\`, \`TEC_PESO\`) VALUES ('6','Facilidade de instalação', '0.5')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_TECNICOS\` (\`TEC_ID\`,\`TEC_DESCRICAO\`, \`TEC_PESO\`) VALUES ('7','Facilidade de uso', '0.5')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_TECNICOS\` (\`TEC_ID\`,\`TEC_DESCRICAO\`, \`TEC_PESO\`) VALUES ('8','Portabilidade', '2.0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_TECNICOS\` (\`TEC_ID\`,\`TEC_DESCRICAO\`, \`TEC_PESO\`) VALUES ('9','Facilidade de mudança', '1.0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_TECNICOS\` (\`TEC_ID\`,\`TEC_DESCRICAO\`, \`TEC_PESO\`) VALUES ('10','Concorrência', '1.0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_TECNICOS\` (\`TEC_ID\`,\`TEC_DESCRICAO\`, \`TEC_PESO\`) VALUES ('11','Características de segurança', '1.0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_TECNICOS\` (\`TEC_ID\`,\`TEC_DESCRICAO\`, \`TEC_PESO\`) VALUES ('12','Acesso a Dispositivos de Terceiros', '1.0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`FATORES_TECNICOS\` (\`TEC_ID\`,\`TEC_DESCRICAO\`, \`TEC_PESO\`) VALUES ('13','Requer Treinamento aos Usuários', '1.0')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`SUITES_DE_TESTE_RELATION_closure\` DROP FOREIGN KEY \`FK_0a663735b1c11c6dfa3ead92b9d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`SUITES_DE_TESTE_RELATION_closure\` DROP FOREIGN KEY \`FK_7a69302bc35bf787fd17ea067f9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`SPRINTS_USERS_STORIES\` DROP FOREIGN KEY \`FK_b878609198e33979b5cab651694\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`SPRINTS_USERS_STORIES\` DROP FOREIGN KEY \`FK_a914f1497fdc7f03ac8a40af0a1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORIES_COLABORADORES\` DROP FOREIGN KEY \`FK_848e3adaa61749ce5f871992906\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORIES_COLABORADORES\` DROP FOREIGN KEY \`FK_3500f15e563669a9d11db7fa376\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORY_ARQUIVOS\` DROP FOREIGN KEY \`FK_f8a81b2401c309e707d8762768e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORY_ARQUIVOS\` DROP FOREIGN KEY \`FK_17071da5d078578dc872197749c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORIES\` DROP FOREIGN KEY \`FK_f67d042a43ca9187f6ffbba1bbd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORIES\` DROP FOREIGN KEY \`FK_009516f3b82af76b34016a8af11\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORIES\` DROP FOREIGN KEY \`FK_6108264ac009132260079873f8c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORIES\` DROP FOREIGN KEY \`FK_28a13d2b8b6e2907e9f73b0812e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`USER_STORIES\` DROP FOREIGN KEY \`FK_48311ce7e29574d5cbe2e57de23\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`SUBTAREFAS\` DROP FOREIGN KEY \`FK_b4640da6feb4e19effbf3e6df9e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`KANBANS\` DROP FOREIGN KEY \`FK_7b35d1df7f716ff30c825ce9897\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`SWIMLANES\` DROP FOREIGN KEY \`FK_58aaf08431b217dc3845c78da5f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`COLABORADORES\` DROP FOREIGN KEY \`FK_65a1f543ddc8b9a47b0e403caa6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`COMENTARIOS\` DROP FOREIGN KEY \`FK_1b34f167eb645f5ed4c44d9444e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`COMENTARIOS\` DROP FOREIGN KEY \`FK_344f8118376d5a82e4ecb4d4923\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`CASOS_DE_TESTE\` DROP FOREIGN KEY \`FK_a4806d23a33189c705eec34ffac\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`CASOS_DE_TESTE\` DROP FOREIGN KEY \`FK_c605514b9a8b8c7d1f0368ab195\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`CASOS_DE_TESTE\` DROP FOREIGN KEY \`FK_bb77d73b65984173fdad8081ea8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`CASOS_DE_TESTE\` DROP FOREIGN KEY \`FK_b4366658430072a75e6767ec866\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`EXECUCOES_DE_TESTE\` DROP FOREIGN KEY \`FK_8814cae507f613801943e0d7f6c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`CASOS_DE_USO\` DROP FOREIGN KEY \`FK_0ecbaa9a062f7a4fbfdd15c9902\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`REQUISITOS_FUNCIONAIS\` DROP FOREIGN KEY \`FK_1670334e6cb5e4a12ae45517cc7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`RESULTADO_REQUISITOS\` DROP FOREIGN KEY \`FK_8b08cf83ffd1e3f815c8b45b6fe\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`PRIORIZACAO_STAKEHOLDERS\` DROP FOREIGN KEY \`FK_26f5cba11cc26d82765cc57eafe\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`PRIORIZACAO_STAKEHOLDERS\` DROP FOREIGN KEY \`FK_18c191a2937d73b149eb6f86597\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`PRIORIZACAO_STAKEHOLDERS\` DROP FOREIGN KEY \`FK_2672110843a47157079202a5cf7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`STAKEHOLDERS\` DROP FOREIGN KEY \`FK_62bc9443115b976b578b5e37dc0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`STAKEHOLDERS\` DROP FOREIGN KEY \`FK_3733a295e8f3c4e6f23f3babc2e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`SUITES_DE_TESTE\` DROP FOREIGN KEY \`FK_b6277b122d6885971d6dfd0ad95\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`SUITES_DE_TESTE\` DROP FOREIGN KEY \`FK_9cbcd836fc4f159ac7e7ca68137\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`FATORES_TECNICOS_PROJETOS\` DROP FOREIGN KEY \`FK_6f81ec50a173807e18b6c813777\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`FATORES_TECNICOS_PROJETOS\` DROP FOREIGN KEY \`FK_41f07677e6f8179942791b2c299\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`FATORES_AMBIENTAIS_PROJETOS\` DROP FOREIGN KEY \`FK_831bb9a8ab96127713017b69a29\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`FATORES_AMBIENTAIS_PROJETOS\` DROP FOREIGN KEY \`FK_33547206e5e9d4aeebbe967b604\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ESTIMATIVAS_ESFORCOS\` DROP FOREIGN KEY \`FK_d8a1435775f634e45757fecc3d5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`COLABORADORES_PROJETOS\` DROP FOREIGN KEY \`FK_21d329dc2438a0d5ce536a3d356\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`COLABORADORES_PROJETOS\` DROP FOREIGN KEY \`FK_671bab7ec79797879138366a686\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`COLABORADORES_PROJETOS\` DROP FOREIGN KEY \`FK_a2f3842c6d1e9da85be63795669\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`STATUS_PRIORIZACAO\` DROP FOREIGN KEY \`FK_fb7231b4eb38ac98b4be32c3c7b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`STATUS_PRIORIZACAO\` DROP FOREIGN KEY \`FK_4e3922310803560cba80659f279\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ATORES\` DROP FOREIGN KEY \`FK_b3ddc2a92caa7c6d1386a1c378b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`CENARIOS\` DROP FOREIGN KEY \`FK_a680e32f58a0d62135d90ec600b\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_0a663735b1c11c6dfa3ead92b9\` ON \`SUITES_DE_TESTE_RELATION_closure\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_7a69302bc35bf787fd17ea067f\` ON \`SUITES_DE_TESTE_RELATION_closure\``,
    );
    await queryRunner.query(`DROP TABLE \`SUITES_DE_TESTE_RELATION_closure\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_b878609198e33979b5cab65169\` ON \`SPRINTS_USERS_STORIES\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a914f1497fdc7f03ac8a40af0a\` ON \`SPRINTS_USERS_STORIES\``,
    );
    await queryRunner.query(`DROP TABLE \`SPRINTS_USERS_STORIES\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_848e3adaa61749ce5f87199290\` ON \`USER_STORIES_COLABORADORES\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3500f15e563669a9d11db7fa37\` ON \`USER_STORIES_COLABORADORES\``,
    );
    await queryRunner.query(`DROP TABLE \`USER_STORIES_COLABORADORES\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f8a81b2401c309e707d8762768\` ON \`USER_STORY_ARQUIVOS\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_17071da5d078578dc872197749\` ON \`USER_STORY_ARQUIVOS\``,
    );
    await queryRunner.query(`DROP TABLE \`USER_STORY_ARQUIVOS\``);
    await queryRunner.query(`DROP TABLE \`USER_STORIES\``);
    await queryRunner.query(`DROP TABLE \`TAGS\``);
    await queryRunner.query(`DROP TABLE \`SUBTAREFAS\``);
    await queryRunner.query(
      `DROP INDEX \`REL_7b35d1df7f716ff30c825ce989\` ON \`KANBANS\``,
    );
    await queryRunner.query(`DROP TABLE \`KANBANS\``);
    await queryRunner.query(`DROP TABLE \`SWIMLANES\``);
    await queryRunner.query(`DROP TABLE \`COLABORADORES\``);
    await queryRunner.query(`DROP TABLE \`COMENTARIOS\``);
    await queryRunner.query(`DROP TABLE \`CASOS_DE_TESTE\``);
    await queryRunner.query(`DROP TABLE \`EXECUCOES_DE_TESTE\``);
    await queryRunner.query(`DROP TABLE \`CASOS_DE_USO\``);
    await queryRunner.query(`DROP TABLE \`REQUISITOS_FUNCIONAIS\``);
    await queryRunner.query(`DROP TABLE \`RESULTADO_REQUISITOS\``);
    await queryRunner.query(`DROP TABLE \`PRIORIZACAO_STAKEHOLDERS\``);
    await queryRunner.query(`DROP TABLE \`STAKEHOLDERS\``);
    await queryRunner.query(`DROP TABLE \`PROJETOS\``);
    await queryRunner.query(`DROP TABLE \`SUITES_DE_TESTE\``);
    await queryRunner.query(`DROP TABLE \`SPRINTS\``);
    await queryRunner.query(`DROP TABLE \`FATORES_TECNICOS_PROJETOS\``);
    await queryRunner.query(`DROP TABLE \`FATORES_TECNICOS\``);
    await queryRunner.query(`DROP TABLE \`FATORES_AMBIENTAIS_PROJETOS\``);
    await queryRunner.query(`DROP TABLE \`FATORES_AMBIENTAIS\``);
    await queryRunner.query(`DROP TABLE \`ESTIMATIVAS_ESFORCOS\``);
    await queryRunner.query(`DROP TABLE \`COLABORADORES_PROJETOS\``);
    await queryRunner.query(`DROP TABLE \`USUARIOS\``);
    await queryRunner.query(`DROP TABLE \`STATUS_PRIORIZACAO\``);
    await queryRunner.query(`DROP TABLE \`ATORES\``);
    await queryRunner.query(`DROP TABLE \`CENARIOS\``);
    await queryRunner.query(`DROP TABLE \`ARQUIVOS\``);
  }
}
