import { Expose } from 'class-transformer';

export class ColaboradorDto {
  @Expose()
  id: number;

  @Expose()
  nome: string;

  @Expose()
  email: string;

  senha: string;

  @Expose()
  empresa: string;

  @Expose()
  cargo:
    | 'Gerente de Projeto'
    | 'Analista de Sistemas'
    | 'Desenvolvedor'
    | 'Product Owner'
    | 'Scrum Master';
}
