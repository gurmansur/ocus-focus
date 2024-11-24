import { ApiProperty } from '@nestjs/swagger';
import { CasoDeTesteDto } from '../../caso-de-teste/dto/caso-de-teste.dto';
import { SuiteDeTesteDto } from './suite-de-teste.dto';

export class FileTreeDto {
  @ApiProperty({
    type: [SuiteDeTesteDto],
    description: 'Suites de teste',
  })
  suites: SuiteDeTesteDto[];

  @ApiProperty({
    type: CasoDeTesteDto,
    description: 'Casos de teste sem suite',
  })
  casos: CasoDeTesteDto[];
}
