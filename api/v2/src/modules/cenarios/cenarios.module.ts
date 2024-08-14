import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CenariosController } from './cenarios.controller';
import { CenariosService } from './cenarios.service';
import { Cenario } from './entities/cenario.entity';

@Module({
  controllers: [CenariosController],
  providers: [CenariosService],
  imports: [TypeOrmModule.forFeature([Cenario])],
})
export class CenariosModule {}
