import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FatorTecnicoProjeto } from './entities/fator-tecnico-projeto.entity';
import { FatorTecnicoProjetoController } from './fator-tecnico-projeto.controller';
import { FatorTecnicoProjetoService } from './fator-tecnico-projeto.service';

@Module({
  controllers: [FatorTecnicoProjetoController],
  providers: [FatorTecnicoProjetoService],
  imports: [TypeOrmModule.forFeature([FatorTecnicoProjeto])],
})
export class FatorTecnicoProjetoModule {}
