import { IsArray, IsNumber } from 'class-validator';

export class UpdateSwimlaneUsDto {
  @IsArray()
  userStories: number[];

  @IsNumber()
  id: number;
}
