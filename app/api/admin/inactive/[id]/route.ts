import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth.middleware';
import { Associate } from '@/lib/database/models';
import { handleError } from '@/lib/errors/error-handler';
import { NotFoundError } from '@/lib/errors/AppError';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    let admin = requireAdmin(request);

    const associate = await Associate.findOne({
      where: { id: params.id, adminId: admin.id, status: 'inactive' },
    });

    if (!associate) {
      throw new NotFoundError('Associado inativo');
    }

    await associate.update({
      status: 'active',
      inactiveReason: null,
      inactiveFile: null,
    });

    const formData = associate.formData as any;
    if (formData.status) {
      formData.status.estadoAtual = 'vinculado';
      formData.status.desvinculacao = null;
      await associate.update({ formData });
    }

    return NextResponse.json({
      success: true,
      message: 'Associado reativado com sucesso',
    });
  } catch (error) {
    return handleError(error);
  }
}
