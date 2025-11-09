import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth.middleware';
import { Form } from '@/lib/database/models';
import { formSchema } from '@/lib/validators/form.validator';
import { handleError } from '@/lib/errors/error-handler';
import { NotFoundError, UnauthorizedError } from '@/lib/errors/AppError';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    let admin = requireAdmin(request);

    let form = await Form.findOne({
      where: { id: params.id, adminId: admin.id },
    });

    if (!form) {
      throw new NotFoundError('Formulário');
    }

    return NextResponse.json({ form });
  } catch (error) {
    return handleError(error);
  }
}
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const admin = requireAdmin(request);
    const body = await request.json();

    const form = await Form.findOne({
      where: { id: params.id, adminId: admin.id },
    });

    if (!form) {
      throw new NotFoundError('Formulário');
    }

    const validatedData = formSchema.parse(body);

    await form.update({
      name: validatedData.name,
      description: validatedData.description,
      surveyJson: validatedData.surveyJson,
    });

    return NextResponse.json({
      success: true,
      form,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const admin = requireAdmin(request);

    const form = await Form.findOne({
      where: { id: params.id, adminId: admin.id },
    });

    if (!form) {
      throw new NotFoundError('Formulário');
    }

    await form.update({ isActive: false });

    return NextResponse.json({
      success: true,
      message: 'Formulário deletado com sucesso',
    });
  } catch (error) {
    return handleError(error);
  }
}
