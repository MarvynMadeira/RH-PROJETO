import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth.middleware';
import { Associate } from '@/lib/database/models';
import { historicoFuncionalSchema } from '@/lib/schemas/historico-funcional.schema';
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
    let validatedData = historicoFuncionalSchema.parse(body);

    await associate.update({
      formData: {
        ...associate.formData,
        historicoFuncional: validatedData,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Histórico funcional atualizado com sucesso',
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
    let admin = requireAdmin(request);

    const associate = await Associate.findOne({
      where: { id: params.id, adminId: admin.id },
    });

    if (!associate) {
      throw new NotFoundError('Associado');
    }

    let historicoFuncional =
      (associate.formData as any).historicoFuncional || null;

    return NextResponse.json({
      historicoFuncional,
    });
  } catch (error) {
    return handleError(error);
  }
}
