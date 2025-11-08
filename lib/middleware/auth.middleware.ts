import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@/lib/errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key';

if (!JWT_SECRET) {
  throw new Error('a chave JWT não está definido no .env.');
}

export interface AuthPayload {
  id: string;
  email?: string;
  username?: string;
  type: 'admin' | 'associate';
}

export function verifyAuth(request: NextRequest): AuthPayload {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token não fornecido');
  }

  const token = authHeader.substring(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expirado');
    }
    throw new UnauthorizedError('Token inválido');
  }
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function requireAdmin(request: NextRequest): AuthPayload {
  const payload = verifyAuth(request);

  if (payload.type !== 'admin') {
    throw new UnauthorizedError('Acesso restrito a administradores');
  }

  return payload;
}

export function requireAssociate(request: NextRequest): AuthPayload {
  const payload = verifyAuth(request);

  if (payload.type !== 'associate') {
    throw new UnauthorizedError('Acesso restrito a associados');
  }
  return payload;
}

export function getTokenFromQuery(request: NextRequest): string | null {
  const { searchParams } = new URL(request.url);
  return searchParams.get('token');
}
