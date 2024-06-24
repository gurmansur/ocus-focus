import { Module } from '@nestjs/common';
import { AtorService } from './ator.service';
import { AtorController } from './ator.controller';

@Module({
  controllers: [AtorController],
  providers: [AtorService],
})
export class AtorModule {}
