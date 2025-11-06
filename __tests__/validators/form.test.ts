import { formSchema } from '@/lib/validators/form.validator';

describe('formSchema', () => {
  describe('validação básica', () => {
    it('deve validar formulário mínimo', () => {
      const data = {
        name: 'Formulário Teste',
        surveyJson: {},
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve rejeitar nome vazio', () => {
      const data = {
        name: '',
        surveyJson: {},
      };
      expect(() => formSchema.parse(data)).toThrow();
    });

    it('deve rejeitar ausência de surveyJson', () => {
      const data = {
        name: 'Formulário Teste',
      };
      expect(() => formSchema.parse(data)).toThrow();
    });

    it('deve aceitar descrição opcional', () => {
      const data = {
        name: 'Formulário Teste',
        description: 'Descrição do formulário',
        surveyJson: {},
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });
  });

  describe('estruturas SurveyJS', () => {
    it('deve validar estrutura SurveyJS básica', () => {
      const data = {
        name: 'Formulário Teste',
        surveyJson: {
          title: 'Cadastro',
          pages: [
            {
              elements: [
                {
                  type: 'text',
                  name: 'nome',
                  title: 'Qual é o seu nome?',
                },
              ],
            },
          ],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve validar formulário com múltiplas páginas', () => {
      const data = {
        name: 'Formulário Teste 2',
        surveyJson: {
          title: 'Pesquisa Avançada',
          showProgressBar: 'top',
          pages: [
            {
              name: 'pagina1',
              elements: [
                { type: 'text', name: 'nome', title: 'Nome' },
                { type: 'text', name: 'email', title: 'Email' },
              ],
            },
            {
              name: 'pagina2',
              title: 'Dados pessoais',
              elements: [
                { type: 'text', name: 'cargo', title: 'Cargo' },
                { type: 'text', name: 'departamento', title: 'Departamento' },
              ],
            },
          ],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve validar formulário com diferentes tipos de elementos', () => {
      const data = {
        name: 'Formulário Teste 3',
        surveyJson: {
          pages: [
            {
              elements: [
                { type: 'text', name: 'nome', title: 'Nome' },
                {
                  type: 'checkbox',
                  name: 'hobbies',
                  title: 'Hobbies',
                  choices: ['Esporte', 'Leitura', 'Viagem'],
                },
                {
                  type: 'radiogroup',
                  name: 'genero',
                  title: 'Gênero',
                  choices: ['Masculino', 'Feminino', 'Outro'],
                },
                { type: 'checkbox', name: 'checkbox' },
                { type: 'dropdown', name: 'dropdown' },
                { type: 'file', name: 'arquivo' },
                { type: 'rating', name: 'avaliacao' },
                { type: 'boolean', name: 'booleano' },
              ],
            },
          ],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve validar formulário com validações', () => {
      const data = {
        name: 'Formulário Teste 4',
        surveyJson: {
          pages: [
            {
              elements: [
                {
                  type: 'text',
                  name: 'email',
                  title: 'Email',
                  isRequired: true,
                  validators: [
                    {
                      type: 'email',
                      text: 'Email inválido',
                    },
                  ],
                },
                {
                  type: 'text',
                  name: 'idade',
                  inputType: 'number',
                  title: 'Idade',
                  validators: [
                    {
                      type: 'numeric',
                      minValue: 18,
                      maxValue: 99,
                      text: 'Idade deve ser entre 18 e 99',
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve validar formulário com lógica condicional', () => {
      const data = {
        name: 'Formulário Teste 5',
        surveyJson: {
          pages: [
            {
              elements: [
                {
                  type: 'radiogroup',
                  name: 'temCarro',
                  title: 'Você possui um carro?',
                  choices: ['Sim', 'Não'],
                },
                {
                  type: 'text',
                  name: 'modeloCarro',
                  title: 'Qual o modelo do seu carro?',
                  visibleIf: "{temCarro} = 'Sim'",
                },
              ],
            },
          ],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });
  });

  describe('propriedades do SurveyJS', () => {
    it('deve aceitar configurações de tema', () => {
      const data = {
        name: 'Formulário Teste 6',
        surveyJson: {
          title: 'cadastro',
          logoPosition: 'right',
          completedHtml: '<h3>Obrigado por participar!</h3>',
          pages: [],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar barra de progresso', () => {
      const data = {
        name: 'Form',
        surveyJson: {
          showProgressBar: 'top',
          progressBarType: 'pages',
          pages: [],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar modo de exibição', () => {
      const data = {
        name: 'Formulário Teste 8',
        surveyJson: {
          mode: 'display',
          showQuestionNumbers: 'off',
          pages: [],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });
  });

  describe('objetos aninhados complexos', () => {
    it('deve aceitar surveyjson com estruturas aninhadas complexas', () => {
      const data = {
        name: 'Formulário Teste 9',
        surveyJson: {
          level1: {
            level2: {
              level3: {
                level4: {
                  value: 'Teste',
                },
              },
            },
          },
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar arrays dentro de surveyjson', () => {
      const data = {
        name: 'Formulário Teste 10',
        surveyJson: {
          customArray: [1, 2, 3, 4, 5],
          nestedArray: [
            [1, 2],
            [3, 4],
          ],
          mixedArray: [1, 'dois', { key: 'value' }, null, true],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar diferentes tipos de valores em surveyjson', () => {
      const data = {
        name: 'Formulário Teste 11',
        surveyJson: {
          string: 'text',
          number: 123,
          boolean: false,
          null: null,
          object: { key: 'value' },
          array: [1, 'dois', { tres: 3 }],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });
  });
  describe('casos de uso reais', () => {
    it('deve validar formulário de cadastro de funcionário', () => {
      const data = {
        name: 'Cadastro de Funcionário',
        description: 'Formulário completo para cadastro de novos funcionários',
        surveyJson: {
          title: 'Cadastro de Funcionário',
          showProgressBar: 'top',
          progressBarType: 'pages',
          pages: [
            {
              name: 'dados_pessoais',
              title: 'Dados Pessoais',
              elements: [
                {
                  type: 'text',
                  name: 'nome_completo',
                  title: 'Nome Completo',
                  isRequired: true,
                },
                {
                  type: 'text',
                  name: 'cpf',
                  title: 'CPF',
                  isRequired: true,
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
                  name: 'email',
                  title: 'Email',
                  inputType: 'email',
                  isRequired: true,
                  validators: [{ type: 'email' }],
                },
                {
                  type: 'text',
                  name: 'telefone',
                  title: 'Telefone',
                  inputType: 'tel',
                },
              ],
            },
            {
              name: 'dados_profissionais',
              title: 'Dados Profissionais',
              elements: [
                {
                  type: 'text',
                  name: 'matricula',
                  title: 'Matrícula',
                  inputType: 'number',
                  isRequired: true,
                },
                {
                  type: 'dropdown',
                  name: 'cargo',
                  title: 'Cargo',
                  isRequired: true,
                  choices: [
                    'Professor',
                    'Coordenador',
                    'Diretor',
                    'Auxiliar',
                    'Secretário',
                  ],
                },
                {
                  type: 'dropdown',
                  name: 'departamento',
                  title: 'Departamento',
                  isRequired: true,
                  choices: [
                    'Ensino Fundamental',
                    'Ensino Médio',
                    'Administração',
                    'Coordenação',
                  ],
                },
                {
                  type: 'text',
                  name: 'data_admissao',
                  title: 'Data de Admissão',
                  inputType: 'date',
                  isRequired: true,
                },
              ],
            },
            {
              name: 'documentos',
              title: 'Documentos',
              elements: [
                {
                  type: 'file',
                  name: 'foto_perfil',
                  title: 'Foto 3x4',
                  description: 'Envie uma foto recente (máx. 2MB)',
                  maxSize: 2097152,
                  acceptedTypes: '.jpg,.jpeg,.png',
                },
                {
                  type: 'file',
                  name: 'documento_identidade',
                  title: 'Documento de Identidade',
                  description: 'RG ou CNH (frente e verso)',
                  isRequired: true,
                  acceptedTypes: '.pdf,.jpg,.jpeg,.png',
                },
              ],
            },
          ],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve validar formulário de avaliação de desempenho', () => {
      const data = {
        name: 'Avaliação de Desempenho',
        description: 'Formulário anual de avaliação de desempenho',
        surveyJson: {
          title: 'Avaliação de Desempenho - 2024',
          pages: [
            {
              name: 'competencias',
              title: 'Competências Técnicas',
              elements: [
                {
                  type: 'rating',
                  name: 'conhecimento_tecnico',
                  title: 'Conhecimento Técnico',
                  isRequired: true,
                  rateMin: 1,
                  rateMax: 5,
                  minRateDescription: 'Insatisfatório',
                  maxRateDescription: 'Excelente',
                },
                {
                  type: 'rating',
                  name: 'produtividade',
                  title: 'Produtividade',
                  isRequired: true,
                  rateMin: 1,
                  rateMax: 5,
                },
                {
                  type: 'rating',
                  name: 'qualidade_trabalho',
                  title: 'Qualidade do Trabalho',
                  isRequired: true,
                  rateMin: 1,
                  rateMax: 5,
                },
              ],
            },
            {
              name: 'comportamentais',
              title: 'Competências Comportamentais',
              elements: [
                {
                  type: 'rating',
                  name: 'trabalho_equipe',
                  title: 'Trabalho em Equipe',
                  isRequired: true,
                  rateMin: 1,
                  rateMax: 5,
                },
                {
                  type: 'rating',
                  name: 'comunicacao',
                  title: 'Comunicação',
                  isRequired: true,
                  rateMin: 1,
                  rateMax: 5,
                },
                {
                  type: 'rating',
                  name: 'lideranca',
                  title: 'Liderança',
                  isRequired: false,
                  rateMin: 1,
                  rateMax: 5,
                },
              ],
            },
            {
              name: 'feedback',
              title: 'Feedback Qualitativo',
              elements: [
                {
                  type: 'comment',
                  name: 'pontos_fortes',
                  title: 'Pontos Fortes',
                  rows: 4,
                },
                {
                  type: 'comment',
                  name: 'pontos_melhoria',
                  title: 'Pontos de Melhoria',
                  rows: 4,
                },
                {
                  type: 'comment',
                  name: 'objetivos_proximos',
                  title: 'Objetivos para o Próximo Período',
                  rows: 4,
                  isRequired: true,
                },
              ],
            },
          ],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve validar formulário de pesquisa de clima organizacional', () => {
      const data = {
        name: 'Pesquisa de Clima Organizacional',
        description: 'Pesquisa anônima sobre satisfação no trabalho',
        surveyJson: {
          title: 'Pesquisa de Clima - 2024',
          description: 'Suas respostas são confidenciais e anônimas',
          showQuestionNumbers: 'off',
          pages: [
            {
              name: 'satisfacao_geral',
              elements: [
                {
                  type: 'radiogroup',
                  name: 'satisfacao_trabalho',
                  title: 'Como você avalia sua satisfação geral no trabalho?',
                  isRequired: true,
                  choices: [
                    'Muito Satisfeito',
                    'Satisfeito',
                    'Neutro',
                    'Insatisfeito',
                    'Muito Insatisfeito',
                  ],
                },
                {
                  type: 'checkbox',
                  name: 'fatores_satisfacao',
                  title:
                    'Quais fatores mais contribuem para sua satisfação? (selecione até 3)',
                  maxSelectedChoices: 3,
                  choices: [
                    'Salário e benefícios',
                    'Ambiente de trabalho',
                    'Reconhecimento',
                    'Desenvolvimento profissional',
                    'Equilíbrio vida-trabalho',
                    'Relacionamento com colegas',
                    'Liderança',
                  ],
                },
              ],
            },
            {
              name: 'ambiente',
              title: 'Ambiente de Trabalho',
              elements: [
                {
                  type: 'rating',
                  name: 'infraestrutura',
                  title: 'Como você avalia a infraestrutura?',
                  rateMin: 1,
                  rateMax: 5,
                },
                {
                  type: 'boolean',
                  name: 'recomendaria_empresa',
                  title:
                    'Você recomendaria esta empresa para amigos/familiares?',
                  isRequired: true,
                },
              ],
            },
            {
              name: 'sugestoes',
              title: 'Sugestões',
              elements: [
                {
                  type: 'comment',
                  name: 'sugestoes_melhorias',
                  title: 'Sugestões de melhorias (opcional)',
                  rows: 5,
                },
              ],
            },
          ],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve validar formulário de solicitação de férias', () => {
      const data = {
        name: 'Solicitação de Férias',
        description: 'Formulário para solicitar período de férias',
        surveyJson: {
          title: 'Solicitação de Férias',
          pages: [
            {
              elements: [
                {
                  type: 'text',
                  name: 'matricula',
                  title: 'Matrícula',
                  inputType: 'number',
                  isRequired: true,
                },
                {
                  type: 'text',
                  name: 'periodo_aquisitivo',
                  title: 'Período Aquisitivo',
                  description: 'Ex: 01/2023 - 12/2023',
                  isRequired: true,
                },
                {
                  type: 'text',
                  name: 'data_inicio',
                  title: 'Data de Início',
                  inputType: 'date',
                  isRequired: true,
                },
                {
                  type: 'text',
                  name: 'data_fim',
                  title: 'Data de Término',
                  inputType: 'date',
                  isRequired: true,
                },
                {
                  type: 'dropdown',
                  name: 'tipo_ferias',
                  title: 'Tipo de Férias',
                  isRequired: true,
                  choices: [
                    '30 dias corridos',
                    '20 dias + 10 dias',
                    '15 dias + 15 dias',
                    '10 dias + 10 dias + 10 dias',
                  ],
                },
                {
                  type: 'boolean',
                  name: 'abono_pecuniario',
                  title: 'Solicitar abono pecuniário (venda de 10 dias)?',
                  defaultValue: false,
                },
                {
                  type: 'comment',
                  name: 'observacoes',
                  title: 'Observações',
                  rows: 3,
                },
              ],
            },
          ],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve validar formulário com lógica condicional complexa', () => {
      const data = {
        name: 'Formulário Condicional',
        description: 'Formulário com múltiplas condições',
        surveyJson: {
          title: 'Cadastro de Curso',
          pages: [
            {
              elements: [
                {
                  type: 'radiogroup',
                  name: 'tipo_curso',
                  title: 'Tipo de Curso',
                  isRequired: true,
                  choices: ['Presencial', 'Online', 'Híbrido'],
                },
                {
                  type: 'text',
                  name: 'endereco',
                  title: 'Endereço',
                  visibleIf:
                    "{tipo_curso} = 'Presencial' or {tipo_curso} = 'Híbrido'",
                  isRequired: true,
                },
                {
                  type: 'text',
                  name: 'link_aula',
                  title: 'Link da Aula Online',
                  visibleIf:
                    "{tipo_curso} = 'Online' or {tipo_curso} = 'Híbrido'",
                  isRequired: true,
                },
                {
                  type: 'boolean',
                  name: 'possui_certificado',
                  title: 'Emite certificado?',
                },
                {
                  type: 'text',
                  name: 'carga_horaria',
                  title: 'Carga Horária (em horas)',
                  inputType: 'number',
                  visibleIf: '{possui_certificado} = true',
                  isRequired: true,
                },
              ],
            },
          ],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve validar formulário multilíngue', () => {
      const data = {
        name: 'Formulário Multilíngue',
        description: 'Formulário com suporte a múltiplos idiomas',
        surveyJson: {
          title: {
            default: 'Registration Form',
            pt: 'Formulário de Cadastro',
            es: 'Formulario de Registro',
          },
          locale: 'pt',
          pages: [
            {
              elements: [
                {
                  type: 'text',
                  name: 'name',
                  title: {
                    default: 'Name',
                    pt: 'Nome',
                    es: 'Nombre',
                  },
                  isRequired: true,
                },
                {
                  type: 'dropdown',
                  name: 'country',
                  title: {
                    default: 'Country',
                    pt: 'País',
                    es: 'País',
                  },
                  choices: [
                    {
                      value: 'BR',
                      text: {
                        default: 'Brazil',
                        pt: 'Brasil',
                        es: 'Brasil',
                      },
                    },
                    {
                      value: 'US',
                      text: {
                        default: 'United States',
                        pt: 'Estados Unidos',
                        es: 'Estados Unidos',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve validar formulário com matriz de perguntas', () => {
      const data = {
        name: 'Formulário com Matriz',
        description: 'Formulário usando matrix type do SurveyJS',
        surveyJson: {
          title: 'Avaliação de Disciplinas',
          pages: [
            {
              elements: [
                {
                  type: 'matrix',
                  name: 'avaliacao_disciplinas',
                  title: 'Avalie as disciplinas cursadas',
                  isRequired: true,
                  columns: [
                    { value: 1, text: 'Ruim' },
                    { value: 2, text: 'Regular' },
                    { value: 3, text: 'Bom' },
                    { value: 4, text: 'Ótimo' },
                    { value: 5, text: 'Excelente' },
                  ],
                  rows: [
                    { value: 'matematica', text: 'Matemática' },
                    { value: 'portugues', text: 'Português' },
                    { value: 'historia', text: 'História' },
                    { value: 'geografia', text: 'Geografia' },
                  ],
                },
              ],
            },
          ],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve validar formulário com panel dinâmico', () => {
      const data = {
        name: 'Formulário com Painéis Dinâmicos',
        description: 'Permite adicionar múltiplas entradas',
        surveyJson: {
          title: 'Cadastro de Dependentes',
          pages: [
            {
              elements: [
                {
                  type: 'paneldynamic',
                  name: 'dependentes',
                  title: 'Dependentes',
                  templateElements: [
                    {
                      type: 'text',
                      name: 'nome_dependente',
                      title: 'Nome do Dependente',
                      isRequired: true,
                    },
                    {
                      type: 'text',
                      name: 'data_nascimento',
                      title: 'Data de Nascimento',
                      inputType: 'date',
                      isRequired: true,
                    },
                    {
                      type: 'dropdown',
                      name: 'grau_parentesco',
                      title: 'Grau de Parentesco',
                      choices: ['Filho(a)', 'Cônjuge', 'Pai/Mãe', 'Outro'],
                      isRequired: true,
                    },
                  ],
                  panelCount: 0,
                  minPanelCount: 0,
                  maxPanelCount: 10,
                  panelAddText: 'Adicionar Dependente',
                  panelRemoveText: 'Remover',
                },
              ],
            },
          ],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve validar formulário com todas as features do SurveyJS', () => {
      const data = {
        name: 'Formulário Completo SurveyJS',
        description: 'Demonstra todas as capacidades do SurveyJS',
        surveyJson: {
          title: 'Formulário Completo',
          description: 'Este formulário demonstra todas as features',
          logo: 'https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg',
          logoPosition: 'right',
          showProgressBar: 'top',
          progressBarType: 'pages',
          showQuestionNumbers: 'onPage',
          questionErrorLocation: 'bottom',
          completedHtml: '<h3>Obrigado por completar o formulário!</h3>',
          loadingHtml: '<h3>Carregando...</h3>',
          pages: [
            {
              name: 'page1',
              title: 'Página 1',
              description: 'Informações básicas',
              elements: [
                { type: 'text', name: 'q1', title: 'Texto simples' },
                { type: 'comment', name: 'q2', title: 'Área de texto' },
                {
                  type: 'radiogroup',
                  name: 'q3',
                  title: 'Radio',
                  choices: ['A', 'B'],
                },
                {
                  type: 'checkbox',
                  name: 'q4',
                  title: 'Checkbox',
                  choices: ['1', '2'],
                },
                {
                  type: 'dropdown',
                  name: 'q5',
                  title: 'Dropdown',
                  choices: ['X', 'Y'],
                },
              ],
            },
            {
              name: 'page2',
              title: 'Página 2',
              elements: [
                {
                  type: 'rating',
                  name: 'q6',
                  title: 'Rating',
                  rateMin: 1,
                  rateMax: 5,
                },
                { type: 'boolean', name: 'q7', title: 'Sim/Não' },
                { type: 'file', name: 'q8', title: 'Upload' },
              ],
            },
          ],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });
  });

  describe('validação de limites e tamanhos', () => {
    it('deve aceitar nome de formulário muito longo', () => {
      const data = {
        name: 'A'.repeat(500),
        surveyJson: {},
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar description muito longa', () => {
      const data = {
        name: 'Test',
        description: 'A'.repeat(5000),
        surveyJson: {},
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar surveyJson com muitas páginas', () => {
      const pages = Array.from({ length: 100 }, (_, i) => ({
        name: `page${i}`,
        elements: [{ type: 'text', name: `q${i}` }],
      }));

      const data = {
        name: 'Formulário Grande',
        surveyJson: { pages },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar surveyJson com muitos elementos', () => {
      const elements = Array.from({ length: 200 }, (_, i) => ({
        type: 'text',
        name: `question${i}`,
        title: `Pergunta ${i}`,
      }));

      const data = {
        name: 'Formulário com Muitas Perguntas',
        surveyJson: {
          pages: [{ elements }],
        },
      };
      expect(() => formSchema.parse(data)).not.toThrow();
    });
  });
});
