import { Expose } from 'class-transformer';

export class PlanoDto {
  @Expose()
  id: number;

  @Expose()
  nome: string;

  @Expose()
  descricao: string;

  @Expose()
  precoMensal: number;

  @Expose()
  precoAnual: number;

  @Expose()
  limiteProjetos: number | null;

  @Expose()
  limiteUsuarios: number | null;

  @Expose()
  ferramentasDisponiveis: string[];

  @Expose()
  caracteristicas: Record<string, any>;

  @Expose()
  ativo: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
