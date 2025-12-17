import { IsNumber } from 'class-validator';

export class CreateStatusPriorizacaoDto {
  @IsNumber()
  stakeholderId: number;
}
