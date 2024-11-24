import { ApiProperty } from '@nestjs/swagger';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { UserStory } from '../../user-story/entities/user-story.entity';
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
