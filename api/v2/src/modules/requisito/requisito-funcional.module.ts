import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjetoModule } from '../projeto/projeto.module';
import { RequisitoFuncional } from './entities/requisito-funcional.entity';
import { RequisitoFuncionalRepository } from './repositories/requisito-funcional.repository';
import { RequisitoController } from './requisito-funcional.controller';
import { RequisitoService } from './requisito-funcional.service';

/**
 * Módulo de requisitos
 * Responsável por gerenciar todas as funcionalidades relacionadas a requisitos
 */
@Module({
  imports: [TypeOrmModule.forFeature([RequisitoFuncional]), ProjetoModule],
  controllers: [RequisitoController],
  providers: [RequisitoService, RequisitoFuncionalRepository],
  exports: [RequisitoService],
})
export class RequisitoModule {}
