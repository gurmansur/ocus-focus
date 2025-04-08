import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreateStakeholderDto {
  @IsString()
  @ApiProperty({ description: 'Propriedade nome' })
  @IsString()
  nome: string;

  @IsString()
  @ApiProperty({ description: 'Propriedade email' })
  @IsString()
  email: string;

  @IsString()
  @ApiProperty({ description: 'Propriedade cargo' })
  @IsString()
  cargo: string;

  @IsString()
  @ApiProperty({ description: 'Propriedade senha' })
  @IsString()
  senha: string;

  @IsString()
  @ApiProperty({ description: 'Propriedade confirmarSenha' })
  @IsString()
  confirmarSenha: string;

  @IsNumberString()
  @ApiProperty({ description: 'Propriedade projeto_id' })
  @IsNumber()
  projeto_id: number;
}
