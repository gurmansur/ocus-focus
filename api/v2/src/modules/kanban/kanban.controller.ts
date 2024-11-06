import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { KanbanService } from './kanban.service';

@UseGuards(AuthGuard)
@ApiTags('Kanban')
@Controller('kanban')
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  @Get()
  findBoard(@Query('projeto') projeto: number) {
    return this.kanbanService.findBoard(projeto);
  }

  @Get('swimlanes')
  findSwimlaneFromProject(@Query('projeto') projeto: number) {
    return this.kanbanService.findSwimlaneFromProject(projeto);
  }

  @Get('id')
  findIdFromProject(@Query('projeto') projeto: number) {
    return this.kanbanService.findIdFromProject(projeto);
  }
}
