import {
  generateAdminToken,
  generateLinkToken,
  generateUsername,
  generatePassword,
} from '@/lib/utils/token.util';

describe('Token Utils', () => {
  describe('generateAdminToken', () => {
    it('deve gerar token único', () => {
      const token = generateAdminToken();
      const token2 = generateAdminToken();
      expect(token).not.toBe(token2);
      expect(token).toHaveLength(32);
    });
  });

  describe('generateLinkToken', () => {
    it('deve gerar token de link único', () => {
      const token = generateLinkToken();
      const token2 = generateLinkToken();
      expect(token).not.toBe(token2);
      expect(token).toHaveLength(64);
    });
  });

  describe('generateUsername', () => {
    it('deve gerar username com prefixo', () => {
      const username = generateUsername('test');
      expect(username).toMatch(/^test_/);
    });

    it('deve gerar username único', () => {
      const username1 = generateUsername();
      const username2 = generateUsername();
      expect(username1).not.toBe(username2);
    });
  });

  describe('generatePassword', () => {
    it('deve gerar senha com comprimento especificado', () => {
      const password = generatePassword(16);
      expect(password).toHaveLength(16);
    });

    it('deve gerar senhas únicas', () => {
      const password1 = generatePassword();
      const password2 = generatePassword();
      expect(password1).not.toBe(password2);
    });

    it('deve conter diferentes tipos de caracteres', () => {
      const password = generatePassword();
      expect(password).toMatch(/[a-z]/); // minúsculas
      expect(password).toMatch(/[A-Z]/); // maiúsculas
      expect(password).toMatch(/[0-9]/); // números
      expect(password).toMatch(/[\W_]/); // caracteres especiais
    });
  });
});
