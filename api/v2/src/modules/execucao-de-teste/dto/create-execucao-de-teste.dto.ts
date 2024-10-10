import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateExecucaoDeTesteDto {
  @ApiProperty({
    type: String,
    description: 'Nome da execução de teste',
    example: 'Execução de teste 1',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    type: Number,
    description: 'ID do caso de teste relacionado',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  casoDeTesteId: number;

  @ApiProperty({
    type: Date,
    description: 'Data de execução da execução de teste',
    example: '2021-10-01T00:00:00.000Z',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataExecucao: Date;
}
