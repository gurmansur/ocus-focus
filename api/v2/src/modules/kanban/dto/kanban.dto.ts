import { ApiProperty } from '@nestjs/swagger';
import { Projeto } from 'src/modules/projeto/entities/projeto.entity';
import { UserStory } from 'src/modules/user-story/entities/user-story.entity';
import { Swimlane } from '../entities/swimlane.entity';

export class KanbanDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  swinlanes: Swimlane[];

  @ApiProperty()
  userStories: UserStory[];

  @ApiProperty()
  projeto: Projeto;
}
