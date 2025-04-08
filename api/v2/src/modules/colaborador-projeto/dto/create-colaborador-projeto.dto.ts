import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';
import { Colaborador } from '../../colaborador/entities/colaborador.entity';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

export class CreateColaboradorProjetoDto {
  @IsBoolean()
@ApiProperty({ description: 'Propriedade ativo' })
  @IsBoolean()
  ativo: boolean

  @IsBoolean()
@ApiProperty({ description: 'Propriedade administrador' })
  @IsBoolean()
  administrador: boolean

  @IsNumber()
@ApiProperty({ description: 'Propriedade colaborador' })
  colaborador: Colaborador

  @IsNumber()
@ApiProperty({ description: 'Propriedade usuario' })
  usuario: Usuario

  @IsNumber()
@ApiProperty({ description: 'Propriedade projeto' })
  projeto: Projeto
}
