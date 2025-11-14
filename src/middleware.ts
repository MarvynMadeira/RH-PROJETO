import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getClientIP, rateLimiters } from '@/lib/rate-limiter';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limiting para rotas públicas sensíveis
  const ip = getClientIP(request);

  // Registro
  if (pathname.startsWith('/api/auth/register')) {
    const limit = rateLimiters.register.check(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: 'Muitas tentativas. Tente novamente mais tarde.',
          resetAt: new Date(limit.resetAt).toISOString(),
        },
        { status: 429 },
      );
    }
  }

  // Upload
  if (pathname.startsWith('/api/upload')) {
    const limit = rateLimiters.upload.check(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Limite de uploads excedido. Aguarde um momento.' },
        { status: 429 },
      );
    }
  }

  // Adicionar headers de segurança
  const response = NextResponse.next();

  // Prevenir clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevenir XSS
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  );

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/formularios/:path*',
    '/associados/:path*',
    '/busca-avancada',
    '/inativos',
  ],
};
