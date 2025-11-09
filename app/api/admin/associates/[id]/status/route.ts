import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth.middleware';
import { Associate } from '@/lib/database/models';
import { statusSchema } from '@/lib/schemas/status.schema';
import { handleError } from '@/lib/errors/error-handler';
import { NotFoundError } from '@/lib/errors/AppError';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    let admin = requireAdmin(request);
    let body = await request.json();

    const associate = await Associate.findOne({
      where: { id: params.id, adminId: admin.id },
    });

    if (!associate) {
      throw new NotFoundError('Associado');
    }

    let validatedData = statusSchema.parse(body);

    if (validatedData.estadoAtual === 'desvinculado') {
      await associate.update({
        status: 'inactive',
        inactiveReason:
          validatedData.desvinculacao?.observacoes || 'Desvinculado',
        inactiveFile: validatedData.desvinculacao?.arquivo || null,
      });
    } else {
      await associate.update({
        status: 'active',
        inactiveReason: null,
        inactiveFile: null,
      });
    }

    await associate.update({
      formData: {
        ...associate.formData,
        status: validatedData,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Status atualizado com sucesso',
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const admin = requireAdmin(request);

    const associate = await Associate.findOne({
      where: { id: params.id, adminId: admin.id },
    });

    if (!associate) {
      throw new NotFoundError('Associado');
    }

    const status = (associate.formData as any).status || null;

    return NextResponse.json({
      status,
    });
  } catch (error) {
    return handleError(error);
  }
}
