import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPlans1705603200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Seed the three plans
    await queryRunner.query(`
      INSERT INTO PLANOS (
        PLA_NOME,
        PLA_DESCRICAO,
        PLA_PRECO_MENSAL,
        PLA_PRECO_ANUAL,
        PLA_LIMITE_PROJETOS,
        PLA_LIMITE_USUARIOS,
        PLA_FERRAMENTAS_DISPONIVEIS,
        PLA_CARACTERISTICAS
      ) VALUES
      (
        'Starter',
        'Plano gratuito para começar',
        0,
        0,
        1,
        1,
        'arcatest,prioreasy',
        '{"type":"free","projects":1,"users":1,"support":"basic","features":["arcatest","prioreasy"]}'
      ),
      (
        'Pro',
        'Plano profissional com todas as ferramentas',
        29.00,
        23.00,
        NULL,
        5,
        'arcatest,prioreasy,estima,flying-cards',
        '{"type":"professional","projects":"unlimited","users":5,"support":"priority","features":["arcatest","prioreasy","estima","flying-cards"],"api":true}'
      ),
      (
        'Team',
        'Plano corporativo com suporte dedicado',
        79.00,
        63.00,
        NULL,
        NULL,
        'arcatest,prioreasy,estima,flying-cards',
        '{"type":"enterprise","projects":"unlimited","users":"unlimited","support":"dedicated","features":["arcatest","prioreasy","estima","flying-cards"],"api":true,"sso":true,"customIntegrations":true}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM PLANOS WHERE PLA_NOME IN ('Starter', 'Pro', 'Team')`,
    );
  }
}
