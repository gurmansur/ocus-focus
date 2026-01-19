import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { ProjetoAtual } from '../../decorators/projeto-atual.decorator';
import { RequiredTool } from '../../decorators/required-tool.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { SubscriptionToolsGuard } from '../../guards/subscription-tools.guard';
import { Projeto } from '../projeto/entities/projeto.entity';
import { SwimlaneDto } from './dto/swimlane.dto';
import { UpdateSwimlaneOrderDto } from './dto/update-swimlane-order.dto';
import { UpdateSwimlaneUsDto } from './dto/update-swimlane-us.dto';
import { UpdateSwimlaneDto } from './dto/update-swimlane.dto';
import { KanbanService } from './kanban.service';

@ApiTags('Kanban')
@ApiBearerAuth()
@UseGuards(AuthGuard, SubscriptionToolsGuard)
@RequiredTool('flying-cards')
@Controller('kanban')
export class KanbanController extends BaseController {
  constructor(private readonly kanbanService: KanbanService) {
    super();
  }

  @Get()
  findBoard(
    @ProjetoAtual() projeto: Projeto,
    @Query('sprint') sprint?: number,
  ) {
    return this.kanbanService.findBoard(projeto.id, sprint);
  }

  @Get('swimlanes')
  findSwimlaneFromProject(@ProjetoAtual() projeto: Projeto) {
    return this.kanbanService.findSwimlaneFromProject(projeto.id);
  }

  @Get('swimlane')
  findSwimlane(@Query('id') id: number, @ProjetoAtual() projeto: Projeto) {
    return this.kanbanService.findOneSwimlane(id, projeto.id);
  }

  @Patch('swimlane/order')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async updateSwimlaneOrder(
    @Body() swimlaneOrderDto: UpdateSwimlaneOrderDto,
    @ProjetoAtual() projeto: Projeto,
  ) {
    // Validate IDs before processing
    if (
      !swimlaneOrderDto.swimlaneIds ||
      !Array.isArray(swimlaneOrderDto.swimlaneIds)
    ) {
      throw new BadRequestException('swimlaneIds must be an array');
    }

    if (swimlaneOrderDto.swimlaneIds.length === 0) {
      throw new BadRequestException('swimlaneIds array cannot be empty');
    }

    // Validate all IDs are valid numbers
    for (const id of swimlaneOrderDto.swimlaneIds) {
      if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
        throw new BadRequestException(`Invalid swimlane ID: ${id}`);
      }
    }

    return this.kanbanService.updateSwimlaneOrder(swimlaneOrderDto);
  }

  @Patch('swimlane/:id')
  updateSwimlane(
    @Param('id') id: string,
    @Body() updateSwimlaneDto: UpdateSwimlaneDto,
    @ProjetoAtual() projeto: Projeto,
  ) {
    return this.kanbanService.updateSwimlane(
      +id,
      updateSwimlaneDto,
      projeto.id,
    );
  }

  @Patch('user-story/update')
  updateSwimlaneUserStories(
    @Body() swimlaneDto: UpdateSwimlaneUsDto,
    @ProjetoAtual() projeto: Projeto,
  ) {
    return this.kanbanService.updateSwimlaneUserStories(
      swimlaneDto,
      projeto.id,
    );
  }

  @Delete('swimlane/:id')
  deleteSwimlane(@Param('id') id: number, @ProjetoAtual() projeto: Projeto) {
    return this.kanbanService.deleteSwimlane(id, projeto.id);
  }

  @Post('swimlane')
  createSwimlane(
    @Body() swimlane: SwimlaneDto,
    @ProjetoAtual() projeto: Projeto,
  ) {
    return this.kanbanService.createSwimlane(swimlane, projeto.id);
  }

  @Get('id')
  findIdFromProject(@ProjetoAtual() projeto: Projeto) {
    return this.kanbanService.findIdFromProject(projeto);
  }
}
