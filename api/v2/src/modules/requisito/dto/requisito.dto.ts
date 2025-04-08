import { ApiProperty } from '@nestjs/swagger';

export class RequisitoDto {
  @ApiProperty({ description: 'ID do requisito' })
  id: number;

  @ApiProperty({ description: 'Nome do requisito' })
  nome: string;

  @ApiProperty({ description: 'Descrição do requisito' })
  descricao: string;

  @ApiProperty({ description: 'Tipo do requisito', enum: ['FUNCIONAL', 'NÃO-FUNCIONAL'] })
  tipo: 'FUNCIONAL' | 'NÃO-FUNCIONAL';

  @ApiProperty({ description: 'Prioridade do requisito', enum: ['ALTA', 'MÉDIA', 'BAIXA'] })
  prioridade: 'ALTA' | 'MÉDIA' | 'BAIXA';

  @ApiProperty({ description: 'Status do requisito', example: 'APROVADO' })
  status: string;

  @ApiProperty({ description: 'ID do projeto ao qual o requisito pertence' })
  projetoId: number;

  @ApiProperty({ description: 'Data de criação do requisito', type: Date })
  dataCriacao: Date;

  @ApiProperty({ description: 'Data da última atualização do requisito', type: Date, required: false })
  dataAtualizacao?: Date;
} 