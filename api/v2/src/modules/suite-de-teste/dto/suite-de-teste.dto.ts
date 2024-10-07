import { ApiProperty } from '@nestjs/swagger';

export class SuiteDeTesteDto {
  @ApiProperty({
    type: 'number',
    description: 'Id da suite de teste',
    example: 1,
  })
  id: number;
}
