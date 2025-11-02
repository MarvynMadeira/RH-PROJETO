import {
  validateCPF,
  formatCPF,
  cleanedCPF,
} from '@/lib/validators/cpf.validator';

describe('CPF Validator', () => {
  describe('validateCPF', () => {
    it('deve validar o CPF correto', () => {
      expect(validateCPF('123.456.789-09')).toBe(true);
      expect(validateCPF('935.411.347-80')).toBe(true);
      expect(validateCPF('93541134780')).toBe(true);
      expect(validateCPF('175.074.957-28')).toBe(true);
    });

    it('deve invalidar o CPF incorreto', () => {
      expect(validateCPF('123.456.789-00')).toBe(false);
      expect(validateCPF('111.111.111-11')).toBe(false);
      expect(validateCPF('935.411.347-81')).toBe(false);
      expect(validateCPF('00000000000')).toBe(false);
    });

    it('deve invalidar CPFs com formato incorreto', () => {
      expect(validateCPF('123.456.78A-09')).toBe(false);
      expect(validateCPF('935.411.347-8X')).toBe(false);
      expect(validateCPF('9354113478Y')).toBe(false);
      expect(validateCPF('123.456.789')).toBe(false);
      expect(validateCPF('123')).toBe(false);
    });

    it('deve invalidar CPF com dígito validador errado', () => {
      expect(validateCPF('175.074.957-29')).toBe(false);
      expect(validateCPF('123.456.789-00')).toBe(false);
    });
  });

  describe('formatCPF', () => {
    it('deve formatar o CPF corretamente', () => {
      expect(formatCPF('12345678909')).toBe('123.456.789-09');
      expect(formatCPF('17507495728')).toBe('175.074.957-28');
    });

    it('deve formatar o CPF já formatado corretamente', () => {
      expect(formatCPF('123.456.789-09')).toBe('123.456.789-09');
      expect(formatCPF('175.074.957-28')).toBe('175.074.957-28');
    });
  });
});

describe('cleanedCPF', () => {
  it('deve remover formatação do CPF', () => {
    expect(cleanedCPF('123.456.789-09')).toBe('12345678909');
    expect(cleanedCPF('175.074.957-28')).toBe('17507495728');
  });
});
