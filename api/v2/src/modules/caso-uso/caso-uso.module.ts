import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequisitoModule } from '../requisito/requisito-funcional.module';
import { CasoUsoController } from './caso-uso.controller';
import { CasoUsoService } from './caso-uso.service';
import { CasoUso } from './entities/caso-uso.entity';

@Module({
  controllers: [CasoUsoController],
  providers: [CasoUsoService],
  imports: [TypeOrmModule.forFeature([CasoUso]), RequisitoModule],
})
export class CasoUsoModule {}
