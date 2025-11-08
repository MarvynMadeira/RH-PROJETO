import { NextResponse } from 'next/server';
import { AppError } from './AppError';
import { ZodError } from 'zod';

export function handleError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode },
    );
  }

  if (error instanceof ZodError) {
    const firstError =
      error.issues[0]?.message || 'Erro de validação desconhecido';
    return NextResponse.json(
      {
        error: firstError,
        code: 'VALIDATION_ERROR',
        fields: error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 },
    );
  }

  if (error instanceof Error && error.name === 'SequelizeValidationError') {
    return NextResponse.json(
      {
        error: 'Dados inválidos',
        code: 'VALIDATION_ERROR',
        details: error.message,
      },
      { status: 400 },
    );
  }

  if (
    error instanceof Error &&
    error.name === 'SequelizeForeignKeyConstraintError'
  ) {
    return NextResponse.json(
      {
        error: 'Erro de integridade referencial',
        code: 'FOREIGN_KEY_ERROR',
      },
      { status: 400 },
    );
  }

  if (error instanceof Error && error.name === 'JsonWebTokenError') {
    return NextResponse.json(
      {
        error: 'Token inválido',
        code: 'INVALID_TOKEN',
      },
      { status: 401 },
    );
  }

  if (error instanceof Error && error.name === 'TokenExpiredError') {
    return NextResponse.json(
      {
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED',
      },
      { status: 401 },
    );
  }

  return NextResponse.json(
    {
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && {
        details: error instanceof Error ? error.message : String(error),
      }),
    },
    { status: 500 },
  );
}

export function asyncHandler(
  handler: (request: any, context?: any) => Promise<NextResponse>,
) {
  return async (request: any, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error);
    }
  };
}
