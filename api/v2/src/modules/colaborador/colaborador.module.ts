import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColaboradorAtualMiddleware } from '../../middlewares/colaborador-atual.middleware';
import { Usuario } from '../usuario/entities/usuario.entity';
import { ColaboradorController } from './colaborador.controller';
import { ColaboradorService } from './colaborador.service';
import { Colaborador } from './entities/colaborador.entity';
import { ColaboradorRepository } from './repositories/colaborador.repository';

/**
 * Módulo de colaboradores
 * Responsável por gerenciar todas as funcionalidades relacionadas a colaboradores
 */
@Module({
  controllers: [ColaboradorController],
  providers: [ColaboradorService, ColaboradorRepository],
  exports: [ColaboradorService],
  imports: [TypeOrmModule.forFeature([Colaborador, Usuario])],
})
export class ColaboradorModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ColaboradorAtualMiddleware).forRoutes('*');
  }
}
