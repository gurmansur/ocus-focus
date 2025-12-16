export class AcaoDeTesteBo {
  id: number;
  ordem: number;
  tipo: string;
  seletor?: string;
  tipoSeletor?: string;
  valor?: string;
  timeout: number;
  descricao?: string;
  obrigatorio: boolean;
  mensagemErro?: string;
  casoDeTesteId: number;
  dataCriacao: Date;
  dataAtualizacao: Date;
}
