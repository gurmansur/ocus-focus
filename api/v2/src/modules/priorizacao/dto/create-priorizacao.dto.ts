import { Type } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';

export class CreatePriorizacaoDto {
  @Type(() => Number)
  @IsNumber()
  requisito: number;

  @IsEnum([
    'GOSTARIA',
    'ESPERADO',
    'NAO IMPORTA',
    'CONVIVO COM ISSO',
    'NAO GOSTARIA',
  ])
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
  classificacaoRequisito:
    | 'DEVE SER FEITO'
    | 'PERFORMANCE'
    | 'ATRATIVO'
    | 'INDIFERENTE'
    | 'QUESTIONAVEL'
    | 'REVERSO';
}
