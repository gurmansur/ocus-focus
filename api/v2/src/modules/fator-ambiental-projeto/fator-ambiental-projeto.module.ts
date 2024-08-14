import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FatorAmbientalProjeto } from './entities/fator-ambiental-projeto.entity';
import { FatorAmbientalProjetoController } from './fator-ambiental-projeto.controller';
import { FatorAmbientalProjetoService } from './fator-ambiental-projeto.service';

@Module({
  controllers: [FatorAmbientalProjetoController],
  providers: [FatorAmbientalProjetoService],
  imports: [TypeOrmModule.forFeature([FatorAmbientalProjeto])],
})
export class FatorAmbientalProjetoModule {}
