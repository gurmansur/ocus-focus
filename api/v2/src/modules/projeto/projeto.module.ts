import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjetoAtualMiddleware } from 'src/middlewares/projeto-atual.middleware';
import { ColaboradorProjetoModule } from '../colaborador-projeto/colaborador-projeto.module';
import { ColaboradorModule } from '../colaborador/colaborador.module';
import { Projeto } from './entities/projeto.entity';
import { ProjetoController } from './projeto.controller';
import { ProjetoService } from './projeto.service';

@Module({
  controllers: [ProjetoController],
  providers: [ProjetoService],
  exports: [ProjetoService],
  imports: [
    TypeOrmModule.forFeature([Projeto]),
    ColaboradorModule,
    ColaboradorProjetoModule,
  ],
})
export class ProjetoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProjetoAtualMiddleware).forRoutes('*');
  }
}
