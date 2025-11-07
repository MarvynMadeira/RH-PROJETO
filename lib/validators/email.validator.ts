import { email, z } from 'zod';
import { normalizeGmail } from '../utils/email-parser.util';

export const emailSchema = z
  .string()
  .email('Email inválido.')
  .transform((email) => email.toLowerCase().trim());

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
  excludeId?: string,
): Promise<{ exists: boolean; normalizedEmail: string; existingRecord?: any }> {
  const normalizedEmail = normalizeGmail(email);

  let where: any = { email: normalizedEmail };

  if (excludeId) {
    const { Op } = require('sequelize');
    where.id = { [Op.ne]: excludeId };
  }
  const existing = await model.findOne({ where });

  return {
    exists: !!existing,
    normalizedEmail,
    existingRecord: existing || undefined,
  };
}
