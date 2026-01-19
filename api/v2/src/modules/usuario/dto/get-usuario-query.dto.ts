import { IsOptional, IsString } from 'class-validator';

export class GetUsuarioQueryDto {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
