import { IsArray } from 'class-validator';

export class UpdateSwimlaneOrderDto {
  @IsArray()
  swimlaneIds: number[];
}
