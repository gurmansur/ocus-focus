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
import { CreateUserStoryDto } from './dto/create-user-story.dto';
import { UpdateUserStoryDto } from './dto/update-user-story.dto';
import { UserStoryService } from './user-story.service';

@UseGuards(AuthGuard)
@Controller('user-story')
export class UserStoryController {
  constructor(private readonly userStoryService: UserStoryService) {}

  @Post()
  create(@Body() createUserStoryDto: CreateUserStoryDto) {
    return this.userStoryService.create(createUserStoryDto);
  }

  @Get()
  findAll() {
    return this.userStoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userStoryService.findOne(+id);
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
