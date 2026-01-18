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
import { AuthGuard } from '../../guards/auth.guard';
import { Projeto } from '../projeto/entities/projeto.entity';
import { SwimlaneDto } from './dto/swimlane.dto';
import { UpdateSwimlaneOrderDto } from './dto/update-swimlane-order.dto';
import { UpdateSwimlaneUsDto } from './dto/update-swimlane-us.dto';
import { UpdateSwimlaneDto } from './dto/update-swimlane.dto';
import { KanbanService } from './kanban.service';

@ApiTags('Kanban')
@Controller('kanban')
export class KanbanController extends BaseController {
  constructor(private readonly kanbanService: KanbanService) {
    super();
  }

  @Get()
  findBoard(
    @Query('projeto') projeto: number,
    @Query('sprint') sprint?: number,
  ) {
    return this.kanbanService.findBoard(projeto, sprint);
  }

  @Get('swimlanes')
  findSwimlaneFromProject(@Query('projeto') projeto: number) {
    return this.kanbanService.findSwimlaneFromProject(projeto);
  }

  @Get('swimlane')
  findSwimlane(@Query('id') id: number) {
    return this.kanbanService.findOneSwimlane(id);
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
  ) {
    return this.kanbanService.updateSwimlane(+id, updateSwimlaneDto);
  }

  @Patch('user-story/update')
  updateSwimlaneUserStories(@Body() swimlaneDto: UpdateSwimlaneUsDto) {
    return this.kanbanService.updateSwimlaneUserStories(swimlaneDto);
  }

  @Delete('swimlane/:id')
  deleteSwimlane(@Param('id') id: number) {
    return this.kanbanService.deleteSwimlane(id);
  }

  @Post('swimlane')
  createSwimlane(@Body() swimlane: SwimlaneDto) {
    return this.kanbanService.createSwimlane(swimlane);
  }

  @Get('id')
  findIdFromProject(@ProjetoAtual() projeto: Projeto) {
    return this.kanbanService.findIdFromProject(projeto);
  }
}
