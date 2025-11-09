import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth.middleware';
import { CustomField } from '@/lib/database/models';
import { handleError } from '@/lib/errors/error-handler';
import { NotFoundError } from '@/lib/errors/AppError';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    let admin = requireAdmin(request);

    const field = await CustomField.findOne({
      where: { id: params.id, adminId: admin.id },
    });

    if (!field) {
      throw new NotFoundError('Campo customizado');
    }

    await field.destroy();

    return NextResponse.json({
      success: true,
      message: 'Campo deletado com sucesso',
    });
  } catch (error) {
    return handleError(error);
  }
}
