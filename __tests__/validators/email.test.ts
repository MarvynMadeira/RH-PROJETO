import { validateEmail } from '@/lib/validators/email.validator';

describe('validateEmail', () => {
  it('deve validar email correto', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
  });

  it('deve invalidar email inválido', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('user@.com')).toBe(false);
    expect(validateEmail('user@domain')).toBe(false);
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
  });
});
