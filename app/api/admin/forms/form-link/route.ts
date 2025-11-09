import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth.middleware';
import { FormLink, Form } from '@/lib/database/models';
import { generateLinkToken } from '@/lib/utils/token.util';
import { handleError } from '@/lib/errors/error-handler';
import { NotFoundError, ValidationError } from '@/lib/errors/AppError';

export async function POST(request: NextRequest) {
  try {
    let admin = requireAdmin(request);

    const { formId, expiresInDays } = (await request.json()) as {
      formId: string;
      expiresInDays?: number;
    };

    if (!formId) {
      throw new ValidationError('formId é obrigatório');
    }

    const days = Number(expiresInDays) || 7;

    if (days <= 0 || days > 365) {
      throw new ValidationError(
        'O prazo de expiração (expiresInDays) deve ser entre 1 e 365 dias.',
      );
    }

    const form = await Form.findOne({
      where: { id: formId, adminId: admin.id },
    });

    if (!form) {
      throw new NotFoundError(
        'Formulário não encontrado ou você não tem permissão para acessá-lo.',
      );
    }

    let token = generateLinkToken();
    let expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    const link = await FormLink.create({
      adminId: admin.id,
      formId,
      token,
      expiresAt,
    });

    let url = `${process.env.NEXT_PUBLIC_APP_URL}/associate/form/${token}`;

    return NextResponse.json({
      success: true,
      url,
      token,
      expiresAt,
    });
  } catch (error) {
    return handleError(error);
  }
}
