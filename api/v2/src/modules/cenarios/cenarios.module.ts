import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasoUsoModule } from '../caso-uso/caso-uso.module';
import { CenariosController } from './cenarios.controller';
import { CenariosService } from './cenarios.service';
import { Cenario } from './entities/cenario.entity';

@Module({
  controllers: [CenariosController],
  providers: [CenariosService],
  imports: [TypeOrmModule.forFeature([Cenario]), CasoUsoModule],
})
export class CenariosModule {}
