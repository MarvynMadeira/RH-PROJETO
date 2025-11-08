import { NextRequest } from 'next/server';
import { Admin } from '../database/models';
import { requireAdmin } from './auth.middleware';
import { NotFoundError, UnauthorizedError } from '../errors/AppError';

export async function verifyAdminExists(request: NextRequest): Promise<Admin> {
  let auth = requireAdmin(request);

  let admin = await Admin.findByPk(auth.id);

  if (!admin) {
    throw new NotFoundError('Administrador não encontrado');
  }

  if (!admin.emailVerified) {
    throw new UnauthorizedError(
      'Email não verificado. Verifique seu email antes de continuar.',
    );
  }
  return admin;
}

export async function verifyResourceOwnership(
  adminId: string,
  resourceAdminId: string,
): Promise<void> {
  if (adminId !== resourceAdminId) {
    throw new UnauthorizedError('Acesso negado a este recurso');
  }
}
