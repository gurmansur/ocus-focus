import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateStakeholderDto } from './dto/create-stakeholder.dto';
import { UpdateStakeholderDto } from './dto/update-stakeholder.dto';
import { StakeholderService } from './stakeholder.service';

@UseGuards(AuthGuard)
@Controller()
export class StakeholderController {
  constructor(private readonly stakeholderService: StakeholderService) {}

  @Post('create-stakeholder')
  create(@Body() createStakeholderDto: CreateStakeholderDto) {
    return this.stakeholderService.create(createStakeholderDto);
  }

  @Get('stakeholders/findByProjeto')
  findByProjeto() {
    return this.stakeholderService.findAll();
  }

  @Get('stakeholders/findByNome')
  findByNome() {
    return this.stakeholderService.findAll();
  }

  @Get('stakeholders/verifyParticipation')
  verifyParticipation() {
    return this.stakeholderService.findAll();
  }

  @Delete('stakeholders/delete')
  remove(@Param('id') id: string) {
    return this.stakeholderService.remove(+id);
  }

  @Patch('stakeholders/alert')
  update(
    @Param('id') id: string,
    @Body() updateStakeholderDto: UpdateStakeholderDto,
  ) {
    return this.stakeholderService.update(+id, updateStakeholderDto);
  }
}
