export class CreateColaboradorDto {
  nome: string;
  email: string;
  senha: string;
  empresa?: string;
  cargo?:
    | 'Gerente de Projeto'
    | 'Analista de Sistemas'
    | 'Desenvolvedor'
    | 'Product Owner'
    | 'Scrum Master';
}
