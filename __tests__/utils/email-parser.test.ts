import {
  parseEmail,
  compareEmail,
  normalizeEmail,
  normalizeGmail,
} from '@/lib/utils/email-parser.util';

describe('Email Parser Utils', () => {
  describe('parseEmail', () => {
    it('deve parsear email simples', () => {
      const result = parseEmail('eduard.cardoz@gmail.com');
      expect(result).toEqual({
        user: 'eduard.cardoz',
        domain: 'gmail.com',
        original: 'eduard.cardoz@gmail.com',
        normalized: 'eduard.cardoz@gmail.com',
      });
    });

    it('deve parsear email com alias (+)', () => {
      const result = parseEmail('eduard.cardoz+abc@gmail.com');
      expect(result).toEqual({
        user: 'eduard.cardoz',
        domain: 'gmail.com',
        original: 'eduard.cardoz+abc@gmail.com',
        normalized: 'eduard.cardoz@gmail.com',
      });
    });

    it('deve converter para lowercase', () => {
      const result = parseEmail('Eduard.Cardoz@Gmail.Com');
      expect(result.user).toBe('eduard.cardoz');
      expect(result.domain).toBe('gmail.com');
    });

    it('deve remover espaços', () => {
      const result = parseEmail('  eduard.cardoz@gmail.com  ');
      expect(result.original).toBe('eduard.cardoz@gmail.com');
    });

    it('deve lidar com múltiplos sinais de +', () => {
      const result = parseEmail('user+tag1+tag2@domain.com');
      expect(result.user).toBe('user');
      expect(result.normalized).toBe('user@domain.com');
    });
  });

  describe('compareEmail', () => {
    it('deve retornar true para emails idênticos', () => {
      expect(
        compareEmail('eduard.cardoz@gmail.com', 'eduard.cardoz@gmail.com'),
      ).toBe(true);
    });

    it('deve retornar false para domínios diferentes', () => {
      expect(
        compareEmail('eduard.cardoz@gmail.com', 'eduard.cardoz@hotmail.com'),
      ).toBe(false);
    });

    it('deve retornar false para usuários diferentes', () => {
      expect(
        compareEmail('eduard.cardoz@gmail.com', 'eduardcardoz@gmail.com'),
      ).toBe(false);
    });

    it('deve retornar true para mesmo email com aliases diferentes', () => {
      expect(
        compareEmail(
          'eduard.cardoz+abc@gmail.com',
          'eduard.cardoz+cde@gmail.com',
        ),
      ).toBe(true);
    });

    it('deve retornar false para alias com domínios diferentes', () => {
      expect(
        compareEmail(
          'eduard.cardoz+abc@gmail.com',
          'eduard.cardoz+cde@hotmail.com',
        ),
      ).toBe(false);
    });

    it('deve retornar false para usuários diferentes com alias', () => {
      expect(
        compareEmail(
          'eduard.cardoz+abc@gmail.com',
          'eduardcardoz+abc@gmail.com',
        ),
      ).toBe(false);
    });

    it('deve ignorar case sensitivity', () => {
      expect(
        compareEmail('Eduard.Cardoz@Gmail.Com', 'eduard.cardoz@gmail.com'),
      ).toBe(true);
    });

    it('deve comparar email com e sem alias', () => {
      expect(compareEmail('user@example.com', 'user+tag@example.com')).toBe(
        true,
      );
    });
  });

  describe('normalizeEmail', () => {
    it('deve normalizar email simples', () => {
      expect(normalizeEmail('User@Example.Com')).toBe('user@example.com');
    });

    it('deve remover alias', () => {
      expect(normalizeEmail('user+tag@example.com')).toBe('user@example.com');
    });

    it('deve remover espaços e converter para lowercase', () => {
      expect(normalizeEmail('  User+Tag@Example.Com  ')).toBe(
        'user@example.com',
      );
    });

    it('deve normalizar emails idênticos para a mesma string', () => {
      const emails = [
        'user@example.com',
        'User@Example.com',
        'user+tag@example.com',
        'USER+another@EXAMPLE.COM',
      ];

      const normalized = emails.map(normalizeEmail);
      const allEqual = normalized.every((e) => e === normalized[0]);

      expect(allEqual).toBe(true);
    });
  });

  describe('normalizeGmail', () => {
    it('deve remover pontos do Gmail', () => {
      expect(normalizeGmail('e.duard.cardoz@gmail.com')).toBe(
        'eduardcardoz@gmail.com',
      );
    });

    it('deve remover pontos e alias do Gmail', () => {
      expect(normalizeGmail('e.duard.cardoz+tag@gmail.com')).toBe(
        'eduardcardoz@gmail.com',
      );
    });

    it('deve tratar googlemail.com como gmail.com', () => {
      expect(normalizeGmail('user.name@googlemail.com')).toBe(
        'username@gmail.com',
      );
    });

    it('NÃO deve remover pontos de outros domínios', () => {
      expect(normalizeGmail('user.name@hotmail.com')).toBe(
        'user.name@hotmail.com',
      );
    });

    it('deve normalizar Gmail complexo', () => {
      expect(normalizeGmail('U.s.E.r+Tag@Gmail.Com')).toBe('user@gmail.com');
    });

    it('deve detectar variações do mesmo Gmail', () => {
      const emails = [
        'eduardcardoz@gmail.com',
        'eduard.cardoz@gmail.com',
        'e.duard.cardoz@gmail.com',
        'eduard.cardoz+work@gmail.com',
        'e.d.u.a.r.d.c.a.r.d.o.z+personal@gmail.com',
      ];

      const normalized = emails.map(normalizeGmail);
      const allEqual = normalized.every((e) => e === normalized[0]);

      expect(allEqual).toBe(true);
      expect(normalized[0]).toBe('eduardcardoz@gmail.com');
    });
  });

  describe('Edge cases', () => {
    it('deve lidar com email sem @', () => {
      const result = parseEmail('invalid-email');
      expect(result.user).toBe('invalid-email');
      expect(result.domain).toBeUndefined();
    });

    it('deve lidar com múltiplos @', () => {
      const result = parseEmail('user@domain@example.com');
      expect(result.user).toBe('user');
    });

    it('deve lidar com + no início', () => {
      const result = parseEmail('+tag@example.com');
      expect(result.user).toBe('');
      expect(result.normalized).toBe('@example.com');
    });

    it('deve lidar com @ no início', () => {
      const result = parseEmail('@example.com');
      expect(result.user).toBe('');
    });

    it('deve lidar com email vazio', () => {
      const result = parseEmail('');
      expect(result.original).toBe('');
    });
  });

  describe('Casos de uso reais', () => {
    it('deve detectar tentativa de cadastro duplicado com alias', () => {
      const emailExistente = 'joao@exemplo.com';
      const tentativaDuplicada = 'joao+123@exemplo.com';

      expect(compareEmail(emailExistente, tentativaDuplicada)).toBe(true);
    });

    it('deve detectar variações do Gmail', () => {
      const emailExistente = 'joaosilva@gmail.com';
      const variacoes = [
        'joao.silva@gmail.com',
        'j.o.a.o.s.i.l.v.a@gmail.com',
        'joaosilva+work@gmail.com',
        'joao.silva+personal@gmail.com',
      ];

      variacoes.forEach((variacao) => {
        expect(normalizeGmail(emailExistente)).toBe(normalizeGmail(variacao));
      });
    });

    it('deve permitir emails diferentes mesmo com parte similar', () => {
      const email1 = 'joao@gmail.com';
      const email2 = 'joaosilva@gmail.com';

      expect(compareEmail(email1, email2)).toBe(false);
    });
  });
});
