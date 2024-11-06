import { IsNumber, IsString } from 'class-validator';

export class CreateUserStoryDto {
  // @ApiProperty({
  //   type: 'string',
  //   description: 'Descrição da User Story',
  //   example:
  //     'O usuário autenticado consegue logar no sistema e acessar seu perfil',
  // })
  @IsString()
  descricao: string;

  // @ApiProperty({
  //   type: 'string',
  //   description: 'Estimativa da User Story',
  //   example: '7',
  // })
  @IsString()
  estimativa_tempo: string;

  // @ApiProperty({
  //   type: 'string',
  //   description: 'Titulo da User Story',
  //   example: 'Acessar o próprio perfil',
  // })
  @IsString()
  titulo: string;

  // @ApiProperty({
  //   type: 'number',
  //   description: 'Id do kanban do projeto',
  //   example: 1,
  // })
  @IsNumber()
  kanban: number;

  // @ApiProperty({
  //   type: 'number',
  //   description: 'Id do usuário que criou a user story',
  //   example: 1,
  // })
  @IsNumber()
  criador: number;

  // @ApiProperty({
  //   type: 'string',
  //   description: 'Id do responsável pela user story',
  //   example: '1',
  // })
  @IsString()
  responsavel: string;

  // @ApiProperty({
  //   type: 'string',
  //   description: 'Id da swimlane que a user story está',
  //   example: '1',
  // })
  @IsString()
  swimlane: string;

  // @ApiProperty({
  //   type: 'number',
  //   description: 'Id do projeto que a user story está',
  //   example: 1,
  // })
  @IsNumber()
  projeto: number;
}
