import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

export class CreatePriorizacaoDto {
  @IsNumber()
@ApiProperty({ description: 'Propriedade requisito' })
  @IsNumber()
  requisito: number

  @IsEnum([
    'GOSTARIA',
    'ESPERADO',
    'NAO IMPORTA',
    'CONVIVO COM ISSO',
    'NAO GOSTARIA',
  ])
@ApiProperty({ description: 'Propriedade respostaNegativa' })
  respostaNegativa: 
    | 'GOSTARIA'
    | 'ESPERADO'
    | 'NAO IMPORTA'
    | 'CONVIVO COM ISSO'
    | 'NAO GOSTARIA';

  @IsEnum([
    'GOSTARIA',
    'ESPERADO',
    'NAO IMPORTA',
    'CONVIVO COM ISSO',
    'NAO GOSTARIA',
  ])
@ApiProperty({ description: 'Propriedade respostaPositiva' })
  respostaPositiva: 
    | 'GOSTARIA'
    | 'ESPERADO'
    | 'NAO IMPORTA'
    | 'CONVIVO COM ISSO'
    | 'NAO GOSTARIA';

  @IsEnum([
    'DEVE SER FEITO',
    'PERFORMANCE',
    'ATRATIVO',
    'INDIFERENTE',
    'QUESTIONAVEL',
    'REVERSO',
  ])
@ApiProperty({ description: 'Propriedade classificacaoRequisito' })
  classificacaoRequisito: 
    | 'DEVE SER FEITO'
    | 'PERFORMANCE'
    | 'ATRATIVO'
    | 'INDIFERENTE'
    | 'QUESTIONAVEL'
    | 'REVERSO';
}
