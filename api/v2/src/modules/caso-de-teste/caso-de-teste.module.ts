import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CenariosModule } from '../cenarios/cenarios.module';
import { ProjetoModule } from '../projeto/projeto.module';
import { SuiteDeTesteModule } from '../suite-de-teste/suite-de-teste.module';
import { CasoDeTesteController } from './caso-de-teste.controller';
import { CasoDeTesteMapper } from './caso-de-teste.mapper';
import { CasoDeTesteService } from './caso-de-teste.service';
import { CasoDeTeste } from './entities/caso-de-teste.entity';
import { CasoDeTesteRepository } from './repositories/caso-de-teste.repository';

/**
 * Módulo de casos de teste
 * Responsável por gerenciar todas as funcionalidades relacionadas a casos de teste
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([CasoDeTeste]),
    ProjetoModule,
    CenariosModule,
    SuiteDeTesteModule,
  ],
  controllers: [CasoDeTesteController],
  providers: [CasoDeTesteService, CasoDeTesteMapper, CasoDeTesteRepository],
  exports: [CasoDeTesteService],
})
export class CasoDeTesteModule {}
