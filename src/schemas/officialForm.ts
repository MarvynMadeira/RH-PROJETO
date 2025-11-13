import { z } from 'zod';

const enderecoSchema = z.object({
  cep: z.string().min(8, 'CEP inválido'),
  logradouro: z.string().min(1, 'Logradouro obrigatório'),
  numero: z.string().min(1, 'Número obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro obrigatório'),
  cidade: z.string().min(1, 'Cidade obrigatória'),
  estado: z.string().length(2, 'Estado deve ter 2 letras'),
  comprovacaoResidencia: z.instanceof(File, {
    message: 'Comprovação de residência é obrigatório',
  }),
});

const dependenteSchema = z.object({
  nome: z.string().min(1, 'Nome do dependente obrigatório'),
  cpf: z.string().min(11, 'CPF inválido'),
  dataNascimento: z.string().min(1, 'Data de nascimento obrigatória'),
});

const tituloEleitorSchema = z.object({
  numero: z.string().min(1, 'Número do título obrigatório'),
  zona: z.string().min(1, 'Zona obrigatória'),
  secao: z.string().min(1, 'Seção obrigatória'),
});

const matriculaSchema = z.object({
  lotacao: z.string().min(1, 'Lotação obrigatória'),
  cargoFuncao: z.enum(['professor', 'outro']),
  cargoFuncaoOutro: z.string().optional(),
  Disciplina: z.string().optional(),
  numeroMatricula: z.string().min(1, 'Número de matrícula obrigatório'),
});

const graduacaoSchema = z.object({
  nomeGraduacao: z.string().min(1, 'Nome da graduação obrigatório'),
  instituicao: z.string().min(1, 'Instituição obrigatória'),
  dataConclusao: z.string().min(1, 'Data de conclusão obrigatória'),
  certificado: z.instanceof(File, {
    message: 'Certificado de graduação é obrigatório',
  }),
});

const posGraduacaoSchema = z.object({
  posGraduadoEm: z.string().min(1, 'Campo obrigatório'),
  instituicao: z.string().min(1, 'Instituição obrigatória'),
  dataConclusao: z.string().min(1, 'Data de conclusão obrigatória'),
  publicacao: z.string().min(1, 'Publicação obrigatória'),
});

const mestradoDoutoradoSchema = z.object({
  tituloEm: z.string().min(1, 'Campo obrigatório'),
  instituicao: z.string().min(1, 'Instituição obrigatória'),
  dataConclusao: z.string().min(1, 'Data de conclusão obrigatória'),
  publicacao: z.string().min(1, 'Publicação obrigatória'),
});

const responsavelSchema = z.object({
  nomeCompleto: z.string().min(1, 'Nome completo obrigatório'),
  data: z.string().min(1, 'Data obrigatória'),
  assinatura: z.instanceof(File, {
    message: 'Assinatura é obrigatória',
  }),
});

export const officialFormSchema = z.object({
  dadosPessoais: z
    .object({
      nomeCompleto: z.string().min(3, 'Insira o nome completo'),
      dataNascimento: z.string().min(1, 'Data de nascimento obrigatória'),
      naturalidade: z.string().min(1, 'Naturalidade obrigatória'),
      endereco: enderecoSchema,
      cpf: z.string().min(11, 'CPF inválido'),
      rg: z.string().min(1, 'RG obrigatório'),
      orgaoExpedidor: z.string().min(1, 'Órgão expedidor obrigatório'),
      rgAnexoFrente: z.instanceof(File, {
        message: 'Anexar seu RG Frente e verso',
      }),
      rgAnexoTras: z.instanceof(File, {
        message: 'Anexar seu RG Frente e verso',
      }),
      vinculacaoParental: z.object({
        nomeMae: z.string().min(1, 'Nome da mãe obrigatório'),
        nomePai: z.string().min(1, 'Nome do pai obrigatório'),
      }),
      estadoCivil: z.enum(['solteiro', 'casado', 'divorciado', 'viuvo']),
      nomeConjuge: z.string().optional(),
      pisPasep: z.string().min(1, 'PIS/PASEP obrigatório'),
      contato: z.object({
        email: z.string().email('Email inválido'),
        telefone: z.string().min(10, 'Telefone inválido'),
      }),
      tituloEleitor: tituloEleitorSchema,
      genero: z.enum([
        'homem_cis',
        'mulher_cis',
        'homem_trans',
        'mulher_trans',
        'nao_identifico',
        'outro',
      ]),
      generoOutro: z.string().optional(),
      certificadoReservista: z.instanceof(File).optional(),
      dependentes: z.array(dependenteSchema).optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.estadoCivil === 'casado' &&
        (!data.nomeConjuge || data.nomeConjuge.trim() === '')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nome do Cônjuge é obrigatório se for casado(a).',
          path: ['nomeConjuge'],
        });
      }
    }),

  situaçãoFuncional: z
    .object({
      formaIngresso: z.enum(['concurso_publico', 'processo_seletivo', 'outro']),
      formaIngressoOutro: z.string().optional(),
      numeroDiarioOficial: z
        .string()
        .min(1, 'Número do Diário Oficial obrigatório'),
      dataNomeacao: z.string().optional(),
      dataPosse_inicio: z.string().min(1, 'Data de posse/início obrigatória'),
      matriculas: z
        .array(matriculaSchema)
        .min(1, 'Pelo menos uma matrícula é obrigatória'),
      jornadaTrabalho: z.number().min(1, 'Jornada de trabalho obrigatória'),
      cargaHorariaReduzida: z
        .object({
          horas: z.number(),
          motivo: z.string(),
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.formaIngresso === 'outro' &&
        (!data.formaIngressoOutro || data.formaIngressoOutro.trim() === '')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A especificação da Forma de Ingresso é obrigatória.',
          path: ['formaIngressoOutro'],
        });
      }

      data.matriculas.forEach((matricula, index) => {
        if (
          matricula.cargoFuncao === 'outro' &&
          (!matricula.cargoFuncaoOutro ||
            matricula.cargoFuncaoOutro.trim() === '')
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'A especificação do Cargo/Função é obrigatória se for "Outro".',
            path: ['matriculas', index, 'cargoFuncaoOutro'],
          });
        }
      });

      data.matriculas.forEach((matricula, index) => {
        if (
          matricula.cargoFuncao === 'professor' &&
          (!matricula.Disciplina || matricula.Disciplina.trim() === '')
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'A Disciplina/Área é obrigatória para Professores.',
            path: ['matriculas', index, 'Disciplina'],
          });
        }
      });
    }),

  titulosFormacao: z.object({
    graduacoes: z
      .array(graduacaoSchema)
      .min(1, 'Pelo menos uma graduação é obrigatória'),
    posGraduacoes: z.array(posGraduacaoSchema).optional(),
    mestradosDoutorados: z.array(mestradoDoutoradoSchema).optional(),
    outrosCursos: z.string().optional(),
  }),

  responsavel: responsavelSchema,
});

export type officialFormData = z.infer<typeof officialFormSchema>;
