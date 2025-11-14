import { z } from 'zod';
import { normalizeGmail } from './email-validator';

// Sanitização de strings (previne XSS)
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validar tamanho de arquivo
export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}

// Validar tipo de arquivo
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
];

export function validateFileType(file: File): boolean {
  return ALLOWED_FILE_TYPES.includes(file.type);
}

// Gerar token seguro
export function generateSecureToken(length: number = 32): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  // Usar crypto.getRandomValues para segurança
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      token += chars[array[i] % chars.length];
    }
  } else if (typeof global !== 'undefined') {
    // Node.js environment
    const crypto = require('crypto');
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      token += chars[bytes[i] % chars.length];
    }
  } else {
    // Fallback (menos seguro)
    for (let i = 0; i < length; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  return token;
}

// Validar CPF mais rigoroso
export function validateCPFStrict(cpf: string): {
  valid: boolean;
  error?: string;
} {
  const cleaned = cpf.replace(/\D/g, '');

  // Verificações básicas
  if (cleaned.length !== 11) {
    return { valid: false, error: 'CPF deve ter 11 dígitos' };
  }

  // CPFs inválidos conhecidos
  const invalidCPFs = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
  ];

  if (invalidCPFs.includes(cleaned)) {
    return { valid: false, error: 'CPF inválido' };
  }

  // Validação dos dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digito1 = resto >= 10 ? 0 : resto;

  if (digito1 !== parseInt(cleaned.charAt(9))) {
    return { valid: false, error: 'CPF inválido' };
  }

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digito2 = resto >= 10 ? 0 : resto;

  if (digito2 !== parseInt(cleaned.charAt(10))) {
    return { valid: false, error: 'CPF inválido' };
  }

  return { valid: true };
}

// Detectar tentativas de SQL Injection (básico)
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|\*|;|'|")/,
    /(\bOR\b|\bAND\b).*=.*/i,
    /(UNION.*SELECT)/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

// Validar URL (para prevenir open redirect)
export function isValidRedirectURL(
  url: string,
  allowedDomains: string[],
): boolean {
  try {
    const parsed = new URL(url);
    return allowedDomains.some((domain) => parsed.hostname.endsWith(domain));
  } catch {
    return false;
  }
}

// Schema de validação para email com normalização
export const emailSchema = z
  .string()
  .email('Email inválido')
  .min(5, 'Email muito curto')
  .max(255, 'Email muito longo')
  .transform((email) => normalizeGmail(email));
