export interface User {
  id: string;
  email: string;
  nome: string;
  created_at: string;
}

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  comprovacaoResidencia: string; // S3 key
}

export interface Dependente {
  nome: string;
  cpf: string;
  dataNascimento: string;
}

export interface Contato {
  email: string;
  telefone: string;
}

export interface TituloEleitor {
  numero: string;
  zona: string;
  secao: string;
}

export interface VinculacaoParental {
  nomeMae: string;
  nomePai: string;
}

export interface DadosPessoais {
  nomeCompleto: string;
  dataNascimento: string;
  naturalidade: string;
  endereco: Endereco;
  cpf: string;
  rg: string;
  rgAnexoFrente: string; // S3 key
  rgAnexoTras: string; // S3 key
  orgaoExpedidor: string;
  vinculacaoParental: VinculacaoParental;
  estadoCivil: 'solteiro' | 'casado' | 'divorciado' | 'viuvo';
  nomeConjuge?: string;
  pisPasep: string;
  contato: Contato;
  tituloEleitor: TituloEleitor;
  genero:
    | 'homem_cis'
    | 'mulher_cis'
    | 'homem_trans'
    | 'mulher_trans'
    | 'nao_identifico'
    | 'outro';
  generoOutro?: string;
  certificadoReservista?: string; // S3 key
  dependentes?: Dependente[];
}

export interface Matricula {
  lotacao: string;
  cargoFuncao: 'professor' | 'outro';
  cargoFuncaoOutro?: string;
  Disciplina?: string;
  numeroMatricula: string;
}

export interface SituacaoFuncional {
  formaIngresso: 'concurso_publico' | 'processo_seletivo' | 'outro';
  formaIngressoOutro?: string;
  numeroDiarioOficial: string;
  dataNomeacao?: string;
  dataPosse_inicio: string;
  matriculas: Matricula[];
  jornadaTrabalho: number;
  cargaHorariaReduzida?: {
    horas: number;
    motivo: string;
  };
}

export interface Graduacao {
  nomeGraduacao: string;
  instituicao: string;
  dataConclusao: string;
  certificado: string; // S3 key
}

export interface PosGraduacao {
  posGraduadoEm: string;
  instituicao: string;
  dataConclusao: string;
  publicacao: string;
}

export interface MestradoDoutorado {
  tituloEm: string;
  instituicao: string;
  dataConclusao: string;
  publicacao: string;
}

export interface TitulosFormacao {
  graduacoes: Graduacao[];
  posGraduacoes?: PosGraduacao[];
  mestradosDoutorados?: MestradoDoutorado[];
  outrosCursos?: string;
}

export interface Responsavel {
  nomeCompleto: string;
  data: string;
  assinatura: string; // S3 key
}

export interface Movimentacao {
  escolaSetorUnidade: string;
  data: string;
}

export interface AlteracaoCargaHoraria {
  de: number;
  para: number;
  dataAlteracao: string;
}

export interface HistoricoFuncional {
  movimentacoes?: Movimentacao[];
  alteracaoCargaHoraria?: AlteracaoCargaHoraria[];
}

export interface PeriodoAvaliacao {
  data: string;
  observacoes?: string;
}

export interface Desvinculacao {
  data: string;
  observacoes: string;
  arquivo?: string; // S3 key
}

export interface Status {
  estagioProbatorio: 'aprovado' | 'em_andamento' | 'reprovado' | 'suspenso';
  periodosAvaliacoes?: PeriodoAvaliacao[];
  estadoAtual: 'vinculado' | 'desvinculado';
  desvinculacao?: Desvinculacao;
}

export interface RequisicaoCustomizada {
  requisicao_id: string;
  nome: string;
  data: string;
  respostas: Record<string, any>;
}

export interface Associado {
  id: string;
  admin_id: string;
  dados_pessoais: DadosPessoais;
  situacao_funcional: SituacaoFuncional;
  titulos_formacao: TitulosFormacao;
  responsavel: Responsavel;
  historico_funcional: HistoricoFuncional;
  status: Status;
  requisicoes_customizadas: RequisicaoCustomizada[];
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormularioLink {
  id: string;
  admin_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface Requisicao {
  id: string;
  admin_id: string;
  nome: string;
  descricao?: string;
  survey_json: Record<string, any>;
  created_at: string;
}

export interface RequisicaoToken {
  id: string;
  requisicao_id: string;
  associado_id: string;
  token: string;
  expires_at: string;
  respondido: boolean;
  respondido_em?: string;
  created_at: string;
}
