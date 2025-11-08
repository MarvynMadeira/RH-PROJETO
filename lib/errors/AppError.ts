export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public code?: string,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Não autorizado') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acesso negado') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Recurso') {
    super(`${resource} não encontrado`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Email já cadastrado') {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class TokenExpiredError extends AppError {
  constructor(message: string = 'Link expirado') {
    super(message, 410, 'TOKEN_EXPIRED');
    this.name = 'TokenExpiredError';
  }
}

export class FileTooLargeError extends AppError {
  constructor(maxSize: string) {
    super(
      `Arquivo muito grande. Tamanho máximo: ${maxSize}`,
      413,
      'FILE_TOO_LARGE',
    );
    this.name = 'FileTooLargeError';
  }
}

export class TooManyRequestsError extends AppError {
  constructor(
    message: string = 'Muitas requisições. Tente novamente mais tarde.',
  ) {
    super(message, 429, 'TOO_MANY_REQUESTS');
    this.name = 'TooManyRequestsError';
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Erro interno do servidor') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
    this.name = 'InternalServerError';
  }
}
