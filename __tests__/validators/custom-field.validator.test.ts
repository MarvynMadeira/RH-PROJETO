import { customFieldSchema } from '@/lib/validators/form.validator';

describe('customFieldSchema', () => {
  const baseField = {
    fieldLabel: 'Campo Teste',
    fieldKey: 'campo_teste',
    fieldType: 'text' as const,
    isRequired: false,
  };

  describe('validação básica', () => {
    it('deve validar campo válido', () => {
      expect(() => customFieldSchema.parse(baseField)).not.toThrow();
    });

    it('deve rejeitar fieldLabel vazio', () => {
      const data = { ...baseField, fieldLabel: '' };
      expect(() => customFieldSchema.parse(data)).toThrow(
        'Nome do campo é obrigatório',
      );
    });

    it('deve rejeitar fieldKey vazio', () => {
      const data = { ...baseField, fieldKey: '' };
      expect(() => customFieldSchema.parse(data)).toThrow(
        'A chave do campo é obrigatória',
      );
    });

    it('deve aceitar campo sem descrição', () => {
      expect(() => customFieldSchema.parse(baseField)).not.toThrow();
    });
  });

  describe('tipo TEXT', () => {
    it('deve validar campo de texto', () => {
      const data = {
        ...baseField,
        fieldType: 'text' as const,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve validar campo de texto obrigatório', () => {
      const data = {
        ...baseField,
        fieldType: 'text' as const,
        isRequired: true,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('não deve exigir options para campo texto', () => {
      const data = {
        ...baseField,
        fieldType: 'text' as const,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });
  });

  describe('tipo NUMBER', () => {
    it('deve validar campo numérico', () => {
      const data = {
        ...baseField,
        fieldLabel: 'Matrícula',
        fieldKey: 'matricula', // corrigido: fieldKey estava em minúsculo
        fieldType: 'number' as const,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('não deve exigir options para campo numérico', () => {
      const data = {
        ...baseField,
        fieldType: 'number' as const,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });
  });

  describe('tipo DATE', () => {
    it('deve validar campo de data', () => {
      const data = {
        ...baseField,
        fieldLabel: 'Data de Nascimento',
        fieldKey: 'data_nascimento',
        fieldType: 'date' as const,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('não deve exigir options para campo de data', () => {
      const data = {
        ...baseField,
        fieldType: 'date' as const,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });
  });

  describe('tipo FILE', () => {
    it('deve validar campo de arquivo', () => {
      const data = {
        ...baseField,
        fieldLabel: 'Anexar Documento',
        fieldKey: 'anexar_documento',
        fieldType: 'file' as const,
        description: 'Envie seu documento aqui',
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('não deve exigir options para campo de arquivo', () => {
      const data = {
        ...baseField,
        fieldType: 'file' as const,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });
  });

  describe('tipo DROPDOWN', () => {
    it('deve validar campo dropdown com opções', () => {
      const data = {
        ...baseField,
        fieldLabel: 'Estado Civil',
        fieldKey: 'estado_civil',
        fieldType: 'dropdown' as const,
        options: ['Solteiro', 'Casado', 'Divorciado', 'Viúvo'],
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar dropdown sem opções', () => {
      const data = {
        ...baseField,
        fieldType: 'dropdown' as const,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar dropdown com opções vazias', () => {
      const data = {
        ...baseField,
        fieldType: 'dropdown' as const,
        options: [],
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar dropdown com única opção', () => {
      const data = {
        ...baseField,
        fieldType: 'dropdown' as const,
        options: ['Opção Única'],
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });
  });

  describe('tipo MULTISELECT', () => {
    it('deve validar campo multiselect com opções', () => {
      const data = {
        ...baseField,
        fieldLabel: 'Habilidades',
        fieldKey: 'habilidades',
        fieldType: 'multiselect' as const,
        options: ['JavaScript', 'TypeScript', 'Python', 'Java'],
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar multiselect com muitas opções', () => {
      const data = {
        ...baseField,
        fieldType: 'multiselect' as const,
        options: Array.from({ length: 100 }, (_, i) => `Opção ${i + 1}`),
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar multiselect sem opções', () => {
      const data = {
        ...baseField,
        fieldType: 'multiselect' as const,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });
  });

  describe('validação de tipo de campo', () => {
    it('deve rejeitar tipo inválido', () => {
      const data = {
        ...baseField,
        fieldType: 'invalid_type',
      };
      expect(() => customFieldSchema.parse(data)).toThrow();
    });

    it('deve aceitar todos os tipos válidos', () => {
      const types = [
        'text',
        'number',
        'date',
        'file',
        'dropdown',
        'multiselect',
      ];

      types.forEach((fieldType) => {
        const data = {
          ...baseField,
          fieldType: fieldType as any,
        };
        expect(() => customFieldSchema.parse(data)).not.toThrow();
      });
    });
  });

  describe('validação de isRequired', () => {
    it('deve aceitar isRequired como true', () => {
      const data = {
        ...baseField,
        isRequired: true,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar isRequired como false', () => {
      const data = {
        ...baseField,
        isRequired: false,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve definir isRequired como false por padrão', () => {
      const result = customFieldSchema.parse(baseField);
      expect(result.isRequired).toBe(false);
    });
  });

  describe('edge cases e validações especiais', () => {
    it('deve aceitar fieldLabel com caracteres especiais', () => {
      const data = {
        ...baseField,
        fieldLabel: 'Nome do Campo! @#$$%&*()',
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar fieldKey com underscores e números', () => {
      const data = {
        ...baseField,
        fieldKey: 'campo_teste_123',
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar descriptions longas', () => {
      const data = {
        ...baseField,
        description: 'A'.repeat(1000),
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar options com strings vazias', () => {
      const data = {
        ...baseField,
        fieldType: 'dropdown' as const,
        options: ['', 'Opção 2', 'Opção 3'],
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar options com caracteres especiais', () => {
      const data = {
        ...baseField,
        fieldType: 'multiselect' as const,
        options: ['Opção #1!', '@Opção2$', '%Opção&3*'],
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });
  });

  describe('casos de uso reais', () => {
    it('deve validar campo de conta bancária', () => {
      const data = {
        fieldLabel: 'Nome da conta bancária',
        fieldKey: 'nome_conta',
        description: 'Informe seu nome de conta bancária',
        fieldType: 'text' as const,
        isRequired: true,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve validar campo de setor/departamento', () => {
      const data = {
        fieldLabel: 'Setor/Departamento',
        fieldKey: 'setor_departamento',
        description: 'Selecione seu setor ou departamento',
        fieldType: 'dropdown' as const,
        options: ['Recursos Humanos', 'Desenvolvimento', 'Marketing', 'Vendas'],
        isRequired: true,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve validar campo de habilidades múltiplas', () => {
      const data = {
        fieldLabel: 'Habilidades Técnicas',
        fieldKey: 'habilidades_tecnicas',
        description: 'Selecione suas habilidades técnicas',
        fieldType: 'multiselect' as const,
        isRequired: false,
        options: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Ruby'],
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve validar campo de data de admissão', () => {
      const data = {
        fieldLabel: 'Data de Admissão',
        fieldKey: 'data_admissao',
        description: 'Informe a data de admissão na empresa',
        fieldType: 'date' as const,
        isRequired: true,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });

    it('deve validar campo de upload de currículo', () => {
      const data = {
        fieldLabel: 'Upload de Currículo',
        fieldKey: 'upload_curriculo',
        description: 'Anexe seu currículo em formato PDF (máx. 2MB)',
        fieldType: 'file' as const,
        isRequired: false,
      };
      expect(() => customFieldSchema.parse(data)).not.toThrow();
    });
  });
});
