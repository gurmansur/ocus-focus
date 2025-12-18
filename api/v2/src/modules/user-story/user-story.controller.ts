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
import { ApiTags } from '@nestjs/swagger';
import { ProjetoAtual } from '../../decorators/projeto-atual.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CreateUserStoryDto } from './dto/create-user-story.dto';
import { UpdateUserStoryDto } from './dto/update-user-story.dto';
import { UserStoryService } from './user-story.service';

@UseGuards(AuthGuard)
@ApiTags('User Story')
@Controller('user-story')
export class UserStoryController {
  constructor(private readonly userStoryService: UserStoryService) {}

  @Get('all')
  findAll(@ProjetoAtual() projetoId: Projeto) {
    return this.userStoryService.findAll(projetoId);
  }

  @Get('projeto/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.userStoryService.findByProject(+projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userStoryService.findOne(+id);
  }

  @Post('new')
  create(@Body() createUserStoryDto: CreateUserStoryDto) {
    return this.userStoryService.create(createUserStoryDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserStoryDto: UpdateUserStoryDto,
  ) {
    return this.userStoryService.update(+id, updateUserStoryDto);
  }

  @Patch(':id/assign-sprint')
  assignToSprint(@Param('id') id: string, @Body() body: { sprintId: number }) {
    return this.userStoryService.assignToSprint(+id, body.sprintId);
  }

  @Patch(':id/remove-sprint')
  removeFromSprint(
    @Param('id') id: string,
    @Body() body: { sprintId: number },
  ) {
    return this.userStoryService.removeFromSprint(+id, body.sprintId);
  }

  @Patch(':id/link-caso-uso')
  linkCasoUso(@Param('id') id: string, @Body() body: { casoUsoId: number }) {
    return this.userStoryService.linkCasoUso(+id, body.casoUsoId);
  }

  @Patch(':id/unlink-caso-uso')
  unlinkCasoUso(@Param('id') id: string, @Body() body: { casoUsoId: number }) {
    return this.userStoryService.unlinkCasoUso(+id, body.casoUsoId);
  }

  @Get(':id/casos-uso')
  getCasosUso(@Param('id') id: string) {
    return this.userStoryService.getCasosUso(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userStoryService.remove(+id);
  }
}
