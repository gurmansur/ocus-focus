import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stakeholder } from './entities/stakeholder.entity';
import { StakeholderController } from './stakeholder.controller';
import { StakeholderService } from './stakeholder.service';

@Module({
  controllers: [StakeholderController],
  providers: [StakeholderService],
  exports: [StakeholderService],
  imports: [TypeOrmModule.forFeature([Stakeholder])],
})
export class StakeholderModule {}
