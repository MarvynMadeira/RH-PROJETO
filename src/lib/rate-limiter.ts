interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

// Limpar entradas antigas a cada 5 minutos
setInterval(
  () => {
    const now = Date.now();
    Object.keys(store).forEach((key) => {
      if (store[key].resetAt < now) {
        delete store[key];
      }
    });
  },
  5 * 60 * 1000,
);

interface RateLimitConfig {
  max: number; // Máximo de requisições
  window: number; // Janela de tempo em ms
}

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  check(identifier: string): {
    allowed: boolean;
    remaining: number;
    resetAt: number;
  } {
    const now = Date.now();
    const key = identifier;

    if (!store[key] || store[key].resetAt < now) {
      // Criar nova entrada
      store[key] = {
        count: 1,
        resetAt: now + this.config.window,
      };

      return {
        allowed: true,
        remaining: this.config.max - 1,
        resetAt: store[key].resetAt,
      };
    }

    // Incrementar contador
    store[key].count++;

    const allowed = store[key].count <= this.config.max;
    const remaining = Math.max(0, this.config.max - store[key].count);

    return {
      allowed,
      remaining,
      resetAt: store[key].resetAt,
    };
  }

  reset(identifier: string): void {
    delete store[identifier];
  }
}

// Configurações de rate limit por tipo
export const rateLimiters = {
  // Registro: 3 tentativas por hora por IP
  register: new RateLimiter({ max: 3, window: 60 * 60 * 1000 }),

  // Login: 5 tentativas por 15 minutos por IP
  login: new RateLimiter({ max: 5, window: 15 * 60 * 1000 }),

  // Upload: 5 arquivos por hora por usuário
  upload: new RateLimiter({ max: 5, window: 60 * 60 * 1000 }),

  // Formulário público: 50 submissões por hora por token
  publicForm: new RateLimiter({ max: 50, window: 60 * 60 * 1000 }),

  // Busca: 30 buscas por minuto por usuário
  search: new RateLimiter({ max: 30, window: 60 * 1000 }),

  // Email: 5 emails por hora por usuário
  email: new RateLimiter({ max: 20, window: 60 * 60 * 1000 }),
};

// Helper para pegar IP do request
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  return 'unknown';
}
