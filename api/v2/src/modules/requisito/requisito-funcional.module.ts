import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequisitoFuncional } from './entities/requisito-funcional.entity';
import { RequisitoController } from './requisito-funcional.controller';
import { RequisitoService } from './requisito-funcional.service';

@Module({
  controllers: [RequisitoController],
  providers: [RequisitoService],
  exports: [RequisitoService],
  imports: [TypeOrmModule.forFeature([RequisitoFuncional])],
})
export class RequisitoModule {}
