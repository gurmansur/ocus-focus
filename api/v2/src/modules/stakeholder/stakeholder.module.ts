import { Module } from '@nestjs/common';
import { StakeholderService } from './stakeholder.service';
import { StakeholderController } from './stakeholder.controller';

@Module({
  controllers: [StakeholderController],
  providers: [StakeholderService],
})
export class StakeholderModule {}
