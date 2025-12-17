import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColaboradorAtualMiddleware } from '../../middlewares/colaborador-atual.middleware';
import { ColaboradorController } from './colaborador.controller';
import { ColaboradorService } from './colaborador.service';
import { Colaborador } from './entities/colaborador.entity';

@Module({
  controllers: [ColaboradorController],
  providers: [ColaboradorService],
  exports: [ColaboradorService],
  imports: [TypeOrmModule.forFeature([Colaborador])],
})
export class ColaboradorModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ColaboradorAtualMiddleware).forRoutes('*');
  }
}
