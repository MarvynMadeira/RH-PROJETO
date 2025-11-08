import { Model } from 'survey-core';
import { officialFormSurveyJSON } from '@/lib/configs/official-form-survey';
import {
  officialFormSchema,
  officialFormData,
} from '@/lib/schemas/official-form.schema';
import { z } from 'zod';

const mockFile = (name: string, type: string = 'application/pdf') =>
  new File(['dummy content'], name, { type });

describe('Validação Zod x SurveyJS (Schema Final)', () => {
  let survey: Model;

  const validData: officialFormData = {
    dadosPessoais: {
      nomeCompleto: 'Fulano de Tal',
      dataNascimento: '1990-01-01',
      naturalidade: 'Rio de Janeiro',
      endereco: {
        cep: '12345678',
        logradouro: 'Rua A',
        numero: '10',
        complemento: '',
        bairro: 'Centro',
        cidade: 'RJ',
        estado: 'RJ',
        comprovacaoResidencia: mockFile('comp.pdf'),
      },
      cpf: '12345678901',
      rg: '123456789',
      orgaoExpedidor: 'DETRAN',
      rgAnexoFrente: mockFile('rg_f.pdf'),
      rgAnexoTras: mockFile('rg_t.pdf'),
      vinculacaoParental: {
        nomeMae: 'Mãe Teste',
        nomePai: 'Pai Teste',
      },
      estadoCivil: 'solteiro',
      pisPasep: '12345678901',
      contato: {
        email: 'teste@email.com',
        telefone: '21987654321',
      },
      tituloEleitor: {
        numero: '1234',
        zona: '1',
        secao: '1',
      },
      genero: 'mulher_cis',
      certificadoReservista: undefined,
      dependentes: [],
    },
    situaçãoFuncional: {
      formaIngresso: 'concurso_publico',
      numeroDiarioOficial: 'DO12345',
      dataPosse_inicio: '2015-03-01',
      matriculas: [
        {
          lotacao: 'Secretaria X',
          cargoFuncao: 'professor',
          Disciplina: 'Português',
          numeroMatricula: 'M123',
        },
      ],
      jornadaTrabalho: 40,
    },
    titulosFormacao: {
      graduacoes: [
        {
          nomeGraduacao: 'Letras',
          instituicao: 'UERJ',
          dataConclusao: '2014-12-20',
          certificado: mockFile('cert_letras.pdf'),
        },
      ],
      posGraduacoes: [
        {
          posGraduadoEm: 'Filologia',
          instituicao: 'UFRJ',
          dataConclusao: '2016-12-20',
          publicacao: 'DOE 123/2017',
        },
      ],
      mestradosDoutorados: [],
      outrosCursos: '',
    },
    responsavel: {
      nomeCompleto: 'Responsável Teste',
      data: '2025-11-08',
      assinatura: mockFile('assinatura.png', 'image/png'),
    },
  };

  beforeEach(() => {
    survey = new Model(officialFormSurveyJSON);
  });

  test('🟢 Deve validar dados mínimos válidos sem erro', () => {
    expect(() => officialFormSchema.parse(validData)).not.toThrow();

    const parsedData = officialFormSchema.parse(validData);
    expect(parsedData.situaçãoFuncional.dataPosse_inicio).toBe('2015-03-01');
  });

  test('🔴 Deve falhar a validação se faltar um campo de File (Certificado de Graduação)', () => {
    const invalidData: officialFormData = {
      ...validData,
      titulosFormacao: {
        ...validData.titulosFormacao,
        graduacoes: [
          {
            ...validData.titulosFormacao.graduacoes[0],
            certificado: undefined as any,
          },
        ],
      },
    };

    const result = officialFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      const errorPath = result.error.issues[0].path.join('.');
      expect(errorPath).toBe('titulosFormacao.graduacoes.0.certificado');
      expect(result.error.issues[0].message).toContain(
        'Certificado de graduação é obrigatório',
      );
    }
  });

  test('🔴 Deve falhar se a validação condicional de Cargo/Função Outro não for satisfeita', () => {
    const invalidData: officialFormData = {
      ...validData,
      situaçãoFuncional: {
        ...validData.situaçãoFuncional,
        formaIngresso: 'outro',
        formaIngressoOutro: '',
      },
    };

    const result = officialFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      const errorPath = result.error.issues[0].path.join('.');
      expect(errorPath).toBe('situaçãoFuncional.formaIngressoOutro');
      expect(result.error.issues[0].message).toContain(
        'A especificação da Forma de Ingresso é obrigatória',
      );
    }
  });

  test('🔴 Deve falhar se a validação condicional de Disciplina não for satisfeita (Professor)', () => {
    const invalidData: officialFormData = {
      ...validData,
      situaçãoFuncional: {
        ...validData.situaçãoFuncional,
        matriculas: [
          {
            lotacao: 'Secretaria X',
            cargoFuncao: 'professor',
            Disciplina: '',
            numeroMatricula: 'M123',
          },
        ],
      },
    };
    const result = officialFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      const errorPath = result.error.issues[0].path.join('.');
      expect(errorPath).toBe('situaçãoFuncional.matriculas.0.Disciplina');
      expect(result.error.issues[0].message).toContain(
        'A Disciplina/Área é obrigatória para Professores',
      );
    }
  });
});
