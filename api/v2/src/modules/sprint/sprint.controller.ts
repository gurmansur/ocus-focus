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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { ProjetoAtual } from '../../decorators/projeto-atual.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SprintService } from './sprint.service';

@ApiTags('Sprint')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('sprint')
export class SprintController extends BaseController {
  constructor(private readonly sprintService: SprintService) {
    super();
  }

  @Post()
  create(
    @Body() createSprintDto: CreateSprintDto,
    @ProjetoAtual() projeto: Projeto,
  ) {
    return this.sprintService.create(createSprintDto, projeto);
  }

  @Get()
  findAll(@ProjetoAtual() projeto: Projeto) {
    return this.sprintService.findAll(projeto);
  }

  @Get('projeto/:projectId')
  findByProject(@ProjetoAtual() projeto: Projeto) {
    return this.sprintService.findByProject(projeto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sprintService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSprintDto: UpdateSprintDto) {
    return this.sprintService.update(+id, updateSprintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sprintService.remove(+id);
  }
}
