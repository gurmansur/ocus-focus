import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para representação de usuário nas respostas da API
 */
export class UsuarioDto {
  @ApiProperty({
    description: 'ID único do usuário no sistema',
    example: 1,
    type: Number
  })
  id: number;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
    type: String
  })
  nome: string;

  @ApiProperty({
    description: 'Endereço de e-mail do usuário',
    example: 'joao.silva@example.com',
    type: String
  })
  email: string;

  @ApiProperty({
    description: 'Perfil de acesso do usuário no sistema',
    enum: ['admin', 'gerente', 'colaborador', 'cliente'],
    example: 'colaborador',
    type: String
  })
  perfil: string;

  @ApiProperty({
    description: 'Telefone de contato do usuário',
    example: '(11) 98765-4321',
    type: String,
    required: false,
    nullable: true
  })
  telefone: string | null;

  @ApiProperty({
    description: 'Indica se o usuário está ativo no sistema',
    example: true,
    type: Boolean
  })
  ativo: boolean;

  @ApiProperty({
    description: 'Data de cadastro do usuário',
    example: '2023-04-08T10:30:00.000Z',
    type: Date
  })
  dataCadastro: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2023-04-10T14:25:30.000Z',
    type: Date,
    required: false,
    nullable: true
  })
  dataAtualizacao: Date | null;
}
