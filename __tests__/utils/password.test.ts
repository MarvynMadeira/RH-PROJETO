import { hashPassword, verifyPassword } from '@/lib/utils/password.util';

describe('Password Utils', () => {
  it('deve fazer hash de senha corretamente', async () => {
    const password = 'MinhaSenhaSegura123!';
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(hash).toMatch(/^\$2[ayb]\$.{56}$/);
  });

  it('deve validar senha corretamente', async () => {
    const password = 'MinhaSenhaSegura123!';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it('deve rejeitar senha incorreta', async () => {
    const password = 'MinhaSenhaSegura123!';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword('wrongPassword', hash);
    expect(isValid).toBe(false);
  });
});
