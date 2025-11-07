import {
  validateCNPJ,
  formatCNPJ,
  cleanedCNPJ,
} from '@/lib/validators/cnpj.validator';

describe('CNPJ Validate', () => {
  it('deve validar CNPJ correto', () => {
    expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
    expect(validateCNPJ('11222333000181')).toBe(true);
  });

  it('deve rejeitar CNPJ com dígitos iguais', () => {
    expect(validateCNPJ('11.111.111/1111-11')).toBe(false);
    expect(validateCNPJ('00000000000000')).toBe(false);
  });

  it('deve rejeitar CNPJ com tamanho incorreto', () => {
    expect(validateCNPJ('11.222.333/0001-8')).toBe(false);
    expect(validateCNPJ('1122233300018')).toBe(false);
    expect(validateCNPJ('11.222.333')).toBe(false);
  });

  it('deve rejeitar CNPJ com dígitos verificadores incorretos', () => {
    expect(validateCNPJ('11.222.333/0001-82')).toBe(false);
    expect(validateCNPJ('11222333000182')).toBe(false);
    expect(validateCNPJ('11.222.333/0001-00')).toBe(false);
  });
});

describe('FormatCNPJ', () => {
  it('deve formatar CNPJ corretamente', () => {
    expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
    expect(formatCNPJ('11.222.333/0001-81')).toBe('11.222.333/0001-81');
  });
});

describe('CleanedCNPJ', () => {
  it('deve remover formatação do CNPJ', () => {
    expect(cleanedCNPJ('11.222.333/0001-81')).toBe('11222333000181');
    expect(cleanedCNPJ('11222333000181')).toBe('11222333000181');
  });
});
