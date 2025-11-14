import { z } from 'zod';
export const officialFormSurveyJSON = {
  title: 'Formulário Oficial de Cadastro',
  showProgressBar: 'top',
  progressBarType: 'pages',
  showQuestionNumbers: 'off',
  pages: [
    {
      name: 'dados_pessoais',
      title: '1. Dados Pessoais',
      elements: [
        {
          type: 'text',
          name: 'dadosPessoais.nomeCompleto',
          title: 'Nome Completo',
          isRequired: true,
        },
        {
          type: 'text',
          name: 'dadosPessoais.dataNascimento',
          title: 'Data de Nascimento',
          inputType: 'date',
          isRequired: true,
        },
        {
          type: 'text',
          name: 'dadosPessoais.naturalidade',
          title: 'Naturalidade',
          isRequired: true,
        },
        {
          type: 'panel',
          name: 'endereco_panel',
          title: 'Endereço',
          elements: [
            {
              type: 'text',
              name: 'dadosPessoais.endereco.cep',
              title: 'CEP',
              isRequired: true,
              inputType: 'text',
              maxLength: 9,
            },
            {
              type: 'text',
              name: 'dadosPessoais.endereco.logradouro',
              title: 'Logradouro',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'dadosPessoais.endereco.numero',
              title: 'Número',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'dadosPessoais.endereco.complemento',
              title: 'Complemento (opcional)',
            },
            {
              type: 'text',
              name: 'dadosPessoais.endereco.bairro',
              title: 'Bairro',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'dadosPessoais.endereco.cidade',
              title: 'Cidade',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'dadosPessoais.endereco.estado',
              title: 'Estado (UF)',
              isRequired: true,
              maxLength: 2,
            },
            {
              type: 'file',
              name: 'dadosPessoais.endereco.comprovacaoResidencia',
              title: 'Comprovação de Residência',
              isRequired: true,
              acceptedTypes: '.pdf,.jpg,.jpeg,.png',
              maxSize: 5242880,
            },
          ],
        },
        {
          type: 'text',
          name: 'dadosPessoais.cpf',
          title: 'CPF',
          isRequired: true,
          inputType: 'text',
          validators: [
            {
              type: 'regex',
              text: 'CPF inválido',
              regex: '^\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}$',
            },
          ],
        },
        {
          type: 'text',
          name: 'dadosPessoais.rg',
          title: 'RG',
          isRequired: true,
        },
        {
          type: 'file',
          name: 'dadosPessoais.rgAnexoFrente',
          title: 'RG - Frente',
          isRequired: true,
          acceptedTypes: '.pdf,.jpg,.jpeg,.png',
        },
        {
          type: 'file',
          name: 'dadosPessoais.rgAnexoTras',
          title: 'RG - Verso',
          isRequired: true,
          acceptedTypes: '.pdf,.jpg,.jpeg,.png',
        },
        {
          type: 'text',
          name: 'dadosPessoais.orgaoExpedidor',
          title: 'Órgão Expedidor',
          isRequired: true,
        },
        {
          type: 'panel',
          name: 'vinculacao_parental',
          title: 'Vinculação Parental',
          elements: [
            {
              type: 'text',
              name: 'dadosPessoais.vinculacaoParental.nomeMae',
              title: 'Nome da Mãe',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'dadosPessoais.vinculacaoParental.nomePai',
              title: 'Nome do Pai',
              isRequired: true,
            },
          ],
        },
        {
          type: 'radiogroup',
          name: 'dadosPessoais.estadoCivil',
          title: 'Estado Civil',
          isRequired: true,
          choices: [
            { value: 'solteiro', text: 'Solteiro(a)' },
            { value: 'casado', text: 'Casado(a)' },
            { value: 'divorciado', text: 'Divorciado(a)' },
            { value: 'viuvo', text: 'Viúvo(a)' },
          ],
        },
        {
          type: 'text',
          name: 'dadosPessoais.nomeConjuge',
          title: 'Nome do Cônjuge',
          visibleIf: "{dadosPessoais.estadoCivil} = 'casado'",
          isRequired: true,
        },
        {
          type: 'text',
          name: 'dadosPessoais.pisPasep',
          title: 'PIS/PASEP',
          isRequired: true,
        },
        {
          type: 'panel',
          name: 'contato_panel',
          title: 'Contato',
          elements: [
            {
              type: 'text',
              name: 'dadosPessoais.contato.email',
              title: 'Email',
              inputType: 'email',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'dadosPessoais.contato.telefone',
              title: 'Telefone',
              inputType: 'tel',
              isRequired: true,
            },
          ],
        },
        {
          type: 'panel',
          name: 'titulo_eleitor_panel',
          title: 'Título de Eleitor',
          elements: [
            {
              type: 'text',
              name: 'dadosPessoais.tituloEleitor.numero',
              title: 'Número',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'dadosPessoais.tituloEleitor.zona',
              title: 'Zona',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'dadosPessoais.tituloEleitor.secao',
              title: 'Seção',
              isRequired: true,
            },
          ],
        },
        {
          type: 'radiogroup',
          name: 'dadosPessoais.genero',
          title: 'Gênero',
          isRequired: true,
          choices: [
            { value: 'homem_cis', text: 'Homem cis' },
            { value: 'mulher_cis', text: 'Mulher cis' },
            { value: 'homem_trans', text: 'Homem trans' },
            { value: 'mulher_trans', text: 'Mulher trans' },
            {
              value: 'nao_identifico',
              text: 'Não me identifico como nenhum destes gêneros',
            },
            { value: 'outro', text: 'Outro' },
          ],
        },
        {
          type: 'text',
          name: 'dadosPessoais.generoOutro',
          title: 'Qual?',
          visibleIf: "{dadosPessoais.genero} = 'outro'",
          isRequired: true,
        },
        {
          type: 'file',
          name: 'dadosPessoais.certificadoReservista',
          title: 'Certificado de Reservista (opcional - apenas para quem tem)',
          acceptedTypes: '.pdf,.jpg,.jpeg,.png',
        },
        {
          type: 'paneldynamic',
          name: 'dadosPessoais.dependentes',
          title: 'Dependentes (opcional)',
          templateElements: [
            { type: 'text', name: 'nome', title: 'Nome', isRequired: true },
            { type: 'text', name: 'cpf', title: 'CPF', isRequired: true },
            {
              type: 'text',
              name: 'dataNascimento',
              title: 'Data de Nascimento',
              inputType: 'date',
              isRequired: true,
            },
          ],
          panelCount: 0,
          panelAddText: '+ Adicionar Dependente',
          panelRemoveText: 'Remover',
        },
      ],
    },
    {
      name: 'situacao_funcional',
      title: '2. Situação Funcional',
      elements: [
        {
          type: 'radiogroup',
          name: 'situacaoFuncional.formaIngresso',
          title: 'Forma de Ingresso',
          isRequired: true,
          choices: [
            { value: 'concurso_publico', text: 'Concurso Público' },
            { value: 'processo_seletivo', text: 'Processo Seletivo' },
            { value: 'outro', text: 'Outro' },
          ],
        },
        {
          type: 'text',
          name: 'situacaoFuncional.formaIngressoOutro',
          title: 'Qual?',
          visibleIf: "{situacaoFuncional.formaIngresso} = 'outro'",
          isRequired: true,
        },
        {
          type: 'text',
          name: 'situacaoFuncional.numeroDiarioOficial',
          title: 'Número do Diário Oficial',
          isRequired: true,
        },
        {
          type: 'text',
          name: 'situacaoFuncional.dataNomeacao',
          title: 'Data de Nomeação (apenas concursados)',
          inputType: 'date',
          visibleIf: "{situacaoFuncional.formaIngresso} = 'concurso_publico'",
        },
        {
          type: 'text',
          name: 'situacaoFuncional.dataPosse_inicio',
          title: 'Data de Posse ou Início das Atividades',
          inputType: 'date',
          isRequired: true,
        },
        {
          type: 'paneldynamic',
          name: 'situacaoFuncional.matriculas',
          title: 'Matrícula(s)',
          isRequired: true,
          templateElements: [
            {
              type: 'text',
              name: 'lotacao',
              title: 'Lotação',
              isRequired: true,
            },
            {
              type: 'radiogroup',
              name: 'cargoFuncao',
              title: 'Cargo/Função',
              isRequired: true,
              choices: [
                { value: 'professor', text: 'Professor' },
                { value: 'outro', text: 'Outro' },
              ],
            },
            {
              type: 'text',
              name: 'cargoFuncaoOutro',
              title: 'Qual?',
              visibleIf: "{panel.cargoFuncao} = 'outro'",
              isRequired: true,
            },
            {
              type: 'text',
              name: 'Disciplina',
              title: 'Disciplina',
              visibleIf: "{panel.cargoFuncao} = 'professor'",
              isRequired: true,
            },
            {
              type: 'text',
              name: 'numeroMatricula',
              title: 'Número de Matrícula',
              isRequired: true,
            },
          ],
          minPanelCount: 1,
          panelAddText: '+ Adicionar Matrícula',
          panelRemoveText: 'Remover',
        },
        {
          type: 'text',
          name: 'situacaoFuncional.jornadaTrabalho',
          title: 'Jornada de Trabalho (horas semanais)',
          inputType: 'number',
          isRequired: true,
        },
        {
          type: 'panel',
          name: 'carga_horaria_reduzida',
          title: 'Carga Horária Reduzida (opcional)',
          elements: [
            {
              type: 'text',
              name: 'situacaoFuncional.cargaHorariaReduzida.horas',
              title: 'Horas Semanais',
              inputType: 'number',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'situacaoFuncional.cargaHorariaReduzida.motivo',
              title: 'Motivo',
              description: 'Explicação breve',
              isRequired: true,
            },
          ],
          visibleIf: 'false',
        },
      ],
    },
    {
      name: 'titulos_formacao',
      title: '3. Títulos de Formação',
      elements: [
        {
          type: 'paneldynamic',
          name: 'titulosFormacao.graduacoes',
          title: 'Graduação',
          isRequired: true,
          templateElements: [
            {
              type: 'text',
              name: 'nomeGraduacao',
              title: 'Nome da Graduação',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'instituicao',
              title: 'Instituição de Ensino',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'dataConclusao',
              title: 'Data de Conclusão',
              inputType: 'date',
              isRequired: true,
            },
            {
              type: 'file',
              name: 'certificado',
              title: 'Certificado',
              isRequired: true,
              acceptedTypes: '.pdf',
            },
          ],
          minPanelCount: 1,
          panelAddText: '+ Adicionar Graduação',
          panelRemoveText: 'Remover',
        },
        {
          type: 'paneldynamic',
          name: 'titulosFormacao.posGraduacoes',
          title: 'Pós-Graduação (opcional)',
          templateElements: [
            {
              type: 'text',
              name: 'posGraduadoEm',
              title: 'Pós-graduado(a) em',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'instituicao',
              title: 'Pela Instituição',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'dataConclusao',
              title: 'Data de Conclusão',
              inputType: 'date',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'publicacao',
              title: 'Publicação (Revista/Diário Oficial)',
              isRequired: true,
            },
          ],
          panelCount: 0,
          panelAddText: '+ Adicionar Pós-Graduação',
          panelRemoveText: 'Remover',
        },
        {
          type: 'paneldynamic',
          name: 'titulosFormacao.mestradosDoutorados',
          title: 'Mestrado/Doutorado (opcional)',
          templateElements: [
            {
              type: 'text',
              name: 'tituloEm',
              title: 'Mestre(a)/Doutor(a) em',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'instituicao',
              title: 'Pela Instituição',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'dataConclusao',
              title: 'Data de Conclusão',
              inputType: 'date',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'publicacao',
              title: 'Publicação (Revista/Diário Oficial)',
              isRequired: true,
            },
          ],
          panelCount: 0,
          panelAddText: '+ Adicionar Mestrado/Doutorado',
          panelRemoveText: 'Remover',
        },
        {
          type: 'comment',
          name: 'titulosFormacao.outrosCursos',
          title: 'Outros Cursos, Capacitações e/ou Graduações',
          description: 'Ex: pós-doutorado em..., concluído em...',
          rows: 5,
        },
      ],
    },
    {
      name: 'responsavel',
      title: '4. Responsável pelo Preenchimento',
      elements: [
        {
          type: 'text',
          name: 'responsavel.nomeCompleto',
          title: 'Nome Completo',
          isRequired: true,
        },
        {
          type: 'text',
          name: 'responsavel.data',
          title: 'Data',
          inputType: 'date',
          isRequired: true,
        },
        {
          type: 'file',
          name: 'responsavel.assinatura',
          title: 'Assinatura',
          description: 'Envie sua assinatura por foto ou digitalização',
          isRequired: true,
          acceptedTypes: '.jpg,.jpeg,.png,.pdf',
        },
      ],
    },
  ],
};

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
      // Validação: Nome do Cônjuge
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
      if (
        data.genero === 'outro' &&
        (!data.generoOutro || data.generoOutro.trim() === '')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A especificação do Gênero é obrigatória.',
          path: ['generoOutro'],
        });
      }
    }),

  situacao_funcional: z
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
          horas: z.number().min(1, 'Horas são obrigatórias'),
          motivo: z.string().min(1, 'Motivo é obrigatório'),
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      // Validação: Forma de Ingresso 'Outro'
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

      // Validação: Matrículas (Cargo/Função e Disciplina)
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
