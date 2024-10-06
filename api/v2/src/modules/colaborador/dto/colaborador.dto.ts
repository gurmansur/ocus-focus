import { Exclude } from 'class-transformer';

export class ColaboradorDto {
  id: number;

  nome: string;

  email: string;

  @Exclude()
  senha: string;

  empresa: string;

  cargo:
    | 'Gerente de Projeto'
    | 'Analista de Sistemas'
    | 'Desenvolvedor'
    | 'Product Owner'
    | 'Scrum Master';
}
