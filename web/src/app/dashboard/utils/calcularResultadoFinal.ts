/**
 * Tipos de respostas possíveis para perguntas positivas e negativas
 */
type TipoResposta =
  | 'GOSTARIA'
  | 'ESPERADO'
  | 'NAO IMPORTA'
  | 'CONVIVO COM ISSO'
  | 'NAO GOSTARIA';

/**
 * Tipos de resultados possíveis após cálculo
 */
type ResultadoFinal =
  | 'ATRATIVO'
  | 'PERFORMANCE'
  | 'DEVE SER FEITO'
  | 'INDIFERENTE'
  | 'REVERSO'
  | 'QUESTIONAVEL'
  | undefined;

/**
 * Matriz de decisão para determinar o resultado baseado nas respostas
 * positivas e negativas. Otimiza o desempenho substituindo múltiplas
 * condicionais por um simples lookup.
 */
const MATRIZ_RESULTADOS: Record<
  TipoResposta | 'undefined',
  Record<TipoResposta | 'undefined', ResultadoFinal>
> = {
  GOSTARIA: {
    GOSTARIA: 'QUESTIONAVEL',
    ESPERADO: 'ATRATIVO',
    'NAO IMPORTA': 'ATRATIVO',
    'CONVIVO COM ISSO': 'ATRATIVO',
    'NAO GOSTARIA': 'PERFORMANCE',
    undefined: undefined,
  },
  ESPERADO: {
    GOSTARIA: 'REVERSO',
    ESPERADO: 'INDIFERENTE',
    'NAO IMPORTA': 'INDIFERENTE',
    'CONVIVO COM ISSO': 'INDIFERENTE',
    'NAO GOSTARIA': 'DEVE SER FEITO',
    undefined: undefined,
  },
  'NAO IMPORTA': {
    GOSTARIA: 'REVERSO',
    ESPERADO: 'INDIFERENTE',
    'NAO IMPORTA': 'INDIFERENTE',
    'CONVIVO COM ISSO': 'INDIFERENTE',
    'NAO GOSTARIA': 'DEVE SER FEITO',
    undefined: undefined,
  },
  'CONVIVO COM ISSO': {
    GOSTARIA: 'REVERSO',
    ESPERADO: 'INDIFERENTE',
    'NAO IMPORTA': 'INDIFERENTE',
    'CONVIVO COM ISSO': 'INDIFERENTE',
    'NAO GOSTARIA': 'DEVE SER FEITO',
    undefined: undefined,
  },
  'NAO GOSTARIA': {
    GOSTARIA: 'REVERSO',
    ESPERADO: 'REVERSO',
    'NAO IMPORTA': 'REVERSO',
    'CONVIVO COM ISSO': 'REVERSO',
    'NAO GOSTARIA': 'QUESTIONAVEL',
    undefined: undefined,
  },
  undefined: {
    GOSTARIA: undefined,
    ESPERADO: undefined,
    'NAO IMPORTA': undefined,
    'CONVIVO COM ISSO': undefined,
    'NAO GOSTARIA': undefined,
    undefined: undefined,
  },
};

/**
 * Calcula o resultado final com base nas respostas positiva e negativa.
 * Utiliza uma matriz de resultados para determinar o resultado de forma eficiente.
 *
 * Implementa o Modelo Kano para classificação de requisitos.
 *
 * @param respPositiva Resposta para a pergunta positiva
 * @param respNegativa Resposta para a pergunta negativa
 * @returns Classificação do requisito segundo o Modelo Kano
 */
export default function calcularResultadoFinal(
  respPositiva: TipoResposta | undefined,
  respNegativa: TipoResposta | undefined
): ResultadoFinal {
  // Converte undefined para string 'undefined' para indexação segura
  const positiva = respPositiva || 'undefined';
  const negativa = respNegativa || 'undefined';

  // Acessa diretamente o resultado na matriz
  return MATRIZ_RESULTADOS[positiva as TipoResposta | 'undefined'][
    negativa as TipoResposta | 'undefined'
  ];
}
