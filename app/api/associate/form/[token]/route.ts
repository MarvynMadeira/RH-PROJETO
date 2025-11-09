import { NextRequest, NextResponse } from 'next/server';
import { FormLink, Form } from '@/lib/database/models';
import { TokenExpiredError, NotFoundError } from '@/lib/errors/AppError';
import { handleError } from '@/lib/errors/error-handler';

interface FormLinkWithForm extends FormLink {
  form: Form;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } },
) {
  try {
    let { token } = params;

    let link = (await FormLink.findOne({
      where: { token, isActive: true },
      include: [{ model: Form, as: 'form' }],
    })) as FormLinkWithForm | null;

    if (!link) {
      throw new NotFoundError('Link não encontrado ou inválido');
    }

    if (new Date() > link.expiresAt) {
      throw new TokenExpiredError('Este link expirou');
    }

    return NextResponse.json({
      surveyJson: link.form.surveyJson,
      formName: link.form.name,
      description: link.form.description,
    });
  } catch (error) {
    return handleError(error);
  }
}
