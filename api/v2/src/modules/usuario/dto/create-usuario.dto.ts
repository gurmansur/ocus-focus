import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
  })
  @IsNotEmpty()
  @IsString()
  senha: string;

  @ApiProperty({
    description: 'Empresa do usuário',
    example: 'Empresa XYZ',
    required: false,
  })
  @IsOptional()
  @IsString()
  empresa?: string;

  @ApiProperty({
    description: 'Cargo do usuário',
    example: 'Desenvolvedor',
    required: false,
  })
  @IsOptional()
  @IsString()
  cargo?: string;

  @ApiProperty({
    description: 'Chave única para stakeholder (legacy)',
    example: 'STAKE-12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  chave?: string;
}
