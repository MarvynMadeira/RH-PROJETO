import { handleError } from '@/lib/errors/error-handler';
import {
  AppError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
} from '@/lib/errors/AppError';
import { ZodError, z } from 'zod';

describe('Error Handler', () => {
  it('deve lidar com AppError', async () => {
    const error = new ValidationError('Campo inválido');
    const response = handleError(error);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Campo inválido');
    expect(data.code).toBe('VALIDATION_ERROR');
  });

  it('deve lidar com UnauthorizedError', async () => {
    const error = new UnauthorizedError('Não autorizado');
    const response = handleError(error);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.code).toBe('UNAUTHORIZED');
  });

  it('deve lidar com NotFoundError', async () => {
    const error = new NotFoundError('Usuário');
    const response = handleError(error);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Usuário não encontrado');
  });

  it('deve lidar com erro genérico', async () => {
    const error = new Error('Erro desconhecido');
    const response = handleError(error);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.code).toBe('INTERNAL_ERROR');
  });

  it('deve lidar com ZodError', async () => {
    const zodError = new ZodError([
      {
        code: z.ZodIssueCode.invalid_type,
        expected: 'string',
        received: 'number',
        path: ['email'],
        message: 'Email inválido',
        fatal: false,
      } as z.ZodIssue,
    ]);

    const response = handleError(zodError);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.code).toBe('VALIDATION_ERROR');
    expect(data.fields).toBeDefined();
  });
});
