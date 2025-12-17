import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class ColaboradorDto {
  @ApiProperty({
    type: 'number',
    description: 'Id do colaborador',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: 'string',
    description: 'Nome do colaborador',
    example: 'Jorge',
  })
  nome: string;

  @ApiProperty({
    type: 'string',
    description: 'Email do colaborador',
    example: 'teste@teste.com',
  })
  email: string;

  @Exclude()
  senha: string;

  @ApiProperty({
    type: 'string',
    description: 'Empresa do colaborador',
    example: 'Empresa 1',
  })
  empresa: string;

  @ApiProperty({
    type: 'enum',
    enum: [
      'Gerente de Projeto',
      'Analista de Sistemas',
      'Desenvolvedor',
      'Product Owner',
      'Scrum Master',
    ],
    description: 'Cargo do colaborador',
    example: 'Gerente de Projeto',
  })
  cargo:
    | 'Gerente de Projeto'
    | 'Analista de Sistemas'
    | 'Desenvolvedor'
    | 'Product Owner'
    | 'Scrum Master';
}
