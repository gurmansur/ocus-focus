import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtorController } from './ator.controller';
import { AtorService } from './ator.service';
import { Ator } from './entities/ator.entity';

@Module({
  controllers: [AtorController],
  providers: [AtorService],
  imports: [TypeOrmModule.forFeature([Ator])],
})
export class AtorModule {}
