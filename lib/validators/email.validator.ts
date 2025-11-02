import { z } from 'zod';

export const emailSchema = z.string().email('Email inválido.');

export function validateEmail(email: string): boolean {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
}

export async function checkEmailExists(
  email: string,
  model: any,
): Promise<boolean> {
  const existing = await model.findOne({ where: { email } });
  return !!existing;
}
