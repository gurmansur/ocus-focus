import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateColaboradorDto {
  @ApiProperty({
    description: 'Nome do colaborador',
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    description: 'Email do colaborador',
    example: 'joao.silva@empresa.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Senha do colaborador',
    example: 'Senha@123',
  })
  @IsString()
  @IsNotEmpty()
  senha: string;

  @ApiProperty({
    description: 'Empresa do colaborador',
    example: 'Empresa ABC',
  })
  @IsString()
  @IsNotEmpty()
  empresa: string;

  @ApiProperty({
    description: 'Cargo do colaborador',
    example: 'Analista de Sistemas',
    enum: ['Gerente de Projeto', 'Analista de Sistemas', 'Desenvolvedor', 'Product Owner', 'Scrum Master'],
  })
  @IsEnum(['Gerente de Projeto', 'Analista de Sistemas', 'Desenvolvedor', 'Product Owner', 'Scrum Master'])
  cargo:
    | 'Gerente de Projeto'
    | 'Analista de Sistemas'
    | 'Desenvolvedor'
    | 'Product Owner'
    | 'Scrum Master';
}
