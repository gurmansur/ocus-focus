import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class StakeholderDto {
  @IsString()
  @Expose()
@ApiProperty({ description: 'Propriedade nome' })
  @IsString()
  nome: string

  @IsString()
  @Expose()
@ApiProperty({ description: 'Propriedade email' })
  @IsString()
  email: string

  @IsString()
  @Expose()
@ApiProperty({ description: 'Propriedade cargo' })
  @IsString()
  cargo: string

  @IsString()
@ApiProperty({ description: 'Propriedade senha' })
  @IsString()
  senha: string
}
