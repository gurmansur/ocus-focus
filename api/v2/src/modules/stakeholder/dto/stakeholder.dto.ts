import { Expose } from 'class-transformer';
import { IsNumberString, IsString } from 'class-validator';

export class StakeholderDto {
  @IsString()
  @Expose()
  nome: string;

  @IsString()
  @Expose()
  email: string;

  @IsString()
  @Expose()
  cargo: string;

  @IsString()
  senha: string;

  @IsNumberString()
  @Expose()
  projeto_id: number;
}
