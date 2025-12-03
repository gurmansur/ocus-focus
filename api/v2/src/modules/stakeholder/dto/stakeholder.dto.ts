import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

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
}
