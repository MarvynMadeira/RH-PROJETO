import { NextRequest, NextResponse } from 'next/server';
import { FieldLink, CustomField } from '@/lib/database/models';
import { TokenExpiredError, NotFoundError } from '@/lib/errors/AppError';
import { handleError } from '@/lib/errors/error-handler';

interface CustomFieldLink extends FieldLink {
  customField: CustomField;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } },
) {
  try {
    const { token } = params;

    const link = (await FieldLink.findOne({
      where: { token, isActive: true, completed: false },
      include: [{ model: CustomField, as: 'customField' }],
    })) as CustomFieldLink | null;

    if (!link) {
      throw new NotFoundError('Link não encontrado ou já utilizado');
    }

    if (new Date() > link.expiresAt) {
      throw new TokenExpiredError('Este link expirou');
    }

    return NextResponse.json({
      fieldKey: link.customField.fieldKey,
      fieldLabel: link.customField.fieldLabel,
      description: link.customField.description,
      fieldType: link.customField.fieldType,
      options: link.customField.options,
      isRequired: link.customField.isRequired,
    });
  } catch (error) {
    return handleError(error);
  }
}
