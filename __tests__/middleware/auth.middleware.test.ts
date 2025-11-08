import { NextRequest } from 'next/server';
import {
  verifyAuth,
  generateToken,
  requireAdmin,
  requireAssociate,
} from '@/lib/middleware/auth.middleware';
import { UnauthorizedError } from '@/lib/errors/AppError';

describe('Auth Middleware', () => {
  const mockRequest = (token?: string) => {
    return {
      headers: {
        get: (key: string) => {
          if (key === 'authorization' && token) {
            return `Bearer ${token}`;
          }
          return null;
        },
      },
    } as unknown as NextRequest;
  };

  describe('generateToken', () => {
    it('deve gerar token JWT válido', () => {
      const payload = { id: '123', type: 'admin' as const };
      const token = generateToken(payload);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    it('deve gerar tokens diferentes para payloads diferentes', () => {
      const token1 = generateToken({ id: '1', type: 'admin' });
      const token2 = generateToken({ id: '2', type: 'admin' });
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyAuth', () => {
    it('deve validar token válido', () => {
      const payload = {
        id: '123',
        email: 'test@example.com',
        type: 'admin' as const,
      };
      const token = generateToken(payload);
      const request = mockRequest(token);

      const result = verifyAuth(request);
      expect(result.id).toBe('123');
      expect(result.type).toBe('admin');
    });

    it('deve rejeitar request sem token', () => {
      const request = mockRequest();
      expect(() => verifyAuth(request)).toThrow(UnauthorizedError);
      expect(() => verifyAuth(request)).toThrow('Token não fornecido');
    });

    it('deve rejeitar token inválido', () => {
      const request = mockRequest('invalid-token');
      expect(() => verifyAuth(request)).toThrow(UnauthorizedError);
      expect(() => verifyAuth(request)).toThrow('Token inválido');
    });

    it('deve rejeitar token sem Bearer', () => {
      const request = {
        headers: {
          get: () => 'some-token',
        },
      } as unknown as NextRequest;

      expect(() => verifyAuth(request)).toThrow('Token não fornecido');
    });
  });

  describe('requireAdmin', () => {
    it('deve permitir acesso de admin', () => {
      const payload = { id: '123', type: 'admin' as const };
      const token = generateToken(payload);
      const request = mockRequest(token);

      const result = requireAdmin(request);
      expect(result.type).toBe('admin');
    });

    it('deve rejeitar acesso de associado', () => {
      const payload = { id: '123', type: 'associate' as const };
      const token = generateToken(payload);
      const request = mockRequest(token);

      expect(() => requireAdmin(request)).toThrow(UnauthorizedError);
      expect(() => requireAdmin(request)).toThrow(
        'Acesso restrito a administradores',
      );
    });
  });

  describe('requireAssociate', () => {
    it('deve permitir acesso de associado', () => {
      const payload = { id: '123', type: 'associate' as const };
      const token = generateToken(payload);
      const request = mockRequest(token);

      const result = requireAssociate(request);
      expect(result.type).toBe('associate');
    });

    it('deve rejeitar acesso de admin', () => {
      const payload = { id: '123', type: 'admin' as const };
      const token = generateToken(payload);
      const request = mockRequest(token);

      expect(() => requireAssociate(request)).toThrow(UnauthorizedError);
      expect(() => requireAssociate(request)).toThrow(
        'Acesso restrito a associados',
      );
    });
  });
});
