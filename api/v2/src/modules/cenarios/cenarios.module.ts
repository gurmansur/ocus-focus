import { Module } from '@nestjs/common';
import { CenariosService } from './cenarios.service';
import { CenariosController } from './cenarios.controller';

@Module({
  controllers: [CenariosController],
  providers: [CenariosService],
})
export class CenariosModule {}
