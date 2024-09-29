import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColaboradorProjetoController } from './colaborador-projeto.controller';
import { ColaboradorProjetoService } from './colaborador-projeto.service';
import { ColaboradorProjeto } from './entities/colaborador-projeto.entity';

@Module({
  controllers: [ColaboradorProjetoController],
  providers: [ColaboradorProjetoService],
  exports: [ColaboradorProjetoService],
  imports: [TypeOrmModule.forFeature([ColaboradorProjeto])],
})
export class ColaboradorProjetoModule {}
