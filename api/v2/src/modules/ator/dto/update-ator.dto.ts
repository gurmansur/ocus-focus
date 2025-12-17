import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateAtorDto {
  @ApiProperty({
    description: 'Nome do ator',
    example: 'Jorge',
    required: false,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  nome: string;

  @ApiProperty({
    description: 'Complexidade do ator',
    type: 'enum',
    enum: ['SIMPLES', 'MEDIO', 'COMPLEXO'],
    example: 'SIMPLES',
    required: false,
  })
  @IsEnum(['SIMPLES', 'MEDIO', 'COMPLEXO'])
  complexidade: 'SIMPLES' | 'MEDIO' | 'COMPLEXO';

  @ApiProperty({
    description: 'Descrição do ator',
    example: 'Ator de teste',
    required: false,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  descricao: string;
}
