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
import { ProjetoAtual } from 'src/decorators/projeto-atual.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
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
  findAll(
    @ProjetoAtual() projetoId: Projeto,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.userStoryService.findAll(projetoId, page, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userStoryService.findOne(+id);
  }

  @Post('new')
  create(
    @Body() createUserStoryDto: CreateUserStoryDto,
    @ProjetoAtual() projeto: Projeto,
  ) {
    return this.userStoryService.create(createUserStoryDto, projeto.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserStoryDto: UpdateUserStoryDto,
  ) {
    return this.userStoryService.update(+id, updateUserStoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userStoryService.remove(+id);
  }
}
