import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColaboradorController } from './colaborador.controller';
import { ColaboradorService } from './colaborador.service';
import { Colaborador } from './entities/colaborador.entity';

@Module({
  controllers: [ColaboradorController],
  providers: [ColaboradorService],
  imports: [TypeOrmModule.forFeature([Colaborador])],
})
export class ColaboradorModule {}
