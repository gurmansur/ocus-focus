import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João da Silva',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'teste@teste.com',
  })
  @IsString()
  email: string;

  @ApiPropertyOptional({
    description: 'Empresa do usuário',
    example: 'Empresa Teste',
  })
  @IsString()
  @IsOptional()
  empresa?: string;

  @ApiPropertyOptional({
    description: 'Cargo do usuário',
    example: 'Desenvolvedor',
  })
  @IsString()
  @IsOptional()
  cargo?: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'Abcd1234!',
  })
  @IsString()
  senha: string;

  @ApiProperty({
    description: 'Confirmação da senha do usuário',
    example: 'Abcd1234!',
  })
  @IsString()
  confirmarSenha: string;
}
