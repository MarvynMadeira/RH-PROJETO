import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth.middleware';
import { Associate } from '@/lib/database/models';
import { handleError } from '@/lib/errors/error-handler';
import { NotFoundError, ValidationError } from '@/lib/errors/AppError';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    let admin = requireAdmin(request);

    const associate = await Associate.findOne({
      where: { id: params.id, adminId: admin.id },
    });

    if (!associate) {
      throw new NotFoundError('Associado');
    }

    return NextResponse.json({
      id: associate.id,
      username: associate.username,
      formData: associate.formData,
      status: associate.status,
      inactiveReason: associate.inactiveReason,
      inactiveFile: associate.inactiveFile,
      createdAt: associate.createdAt,
      updatedAt: associate.updatedAt,
    });
  } catch (error) {
    return handleError(error);
  }
}

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

    if (body.formData) {
      await associate.update({
        formData: {
          ...associate.formData,
          ...body.formData,
        },
      });
    }

    if (body.status) {
      if (body.status === 'inactive' && !body.inactiveReason) {
        throw new ValidationError('Motivo da inativação é obrigatório');
      }

      await associate.update({
        status: body.status,
        inactiveReason: body.status === 'inactive' ? body.inactiveReason : null,
        inactiveFile: body.inactiveFile || null,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Associado atualizado com sucesso',
      associate,
    });
  } catch (error) {
    return handleError(error);
  }
}
