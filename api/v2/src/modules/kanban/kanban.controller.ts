import {
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
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { SwimlaneDto } from './dto/swimlane.dto';
import { UpdateSwimlaneUsDto } from './dto/update-swimlane-us.dto';
import { UpdateSwimlaneDto } from './dto/update-swimlane.dto';
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

  @Get('swimlane')
  findSwimlane(@Query('id') id: number) {
    return this.kanbanService.findOneSwimlane(id);
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
  findIdFromProject(@Query('projeto') projeto: number) {
    return this.kanbanService.findIdFromProject(projeto);
  }
}
