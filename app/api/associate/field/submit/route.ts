import { NextRequest, NextResponse } from 'next/server';
import { FieldLink, Associate, CustomField } from '@/lib/database/models';
import { saveDoc } from '@/lib/utils/file.util';
import { handleError } from '@/lib/errors/error-handler';
import { TokenExpiredError, NotFoundError } from '@/lib/errors/AppError';

interface FieldLinkSubmit extends FieldLink {
  customField: CustomField;
  associate: Associate;
}

export async function POST(request: NextRequest) {
  try {
    const { token, value } = await request.json();

    const link = (await FieldLink.findOne({
      where: { token, isActive: true, completed: false },
      include: [
        { model: CustomField, as: 'customField' },
        { model: Associate, as: 'associate' },
      ],
    })) as FieldLinkSubmit | null;

    if (!link) {
      throw new NotFoundError('Link');
    }

    if (new Date() > link.expiresAt) {
      throw new TokenExpiredError();
    }

    let processedValue = value;
    if (
      link.customField.fieldType === 'file' &&
      typeof value === 'string' &&
      value.startsWith('data:')
    ) {
      processedValue = await saveDoc(
        value,
        link.customField.fieldKey,
        'associates',
      );
    }

    const currentFormData = (link.associate.formData as any) || {};
    const customFields = currentFormData.customFields || {};

    await link.associate.update({
      formData: {
        ...currentFormData,
        customFields: {
          ...customFields,
          [link.customField.fieldKey]: processedValue,
        },
      },
    });

    await link.update({
      completed: true,
      completedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Campo atualizado com sucesso',
    });
  } catch (error) {
    return handleError(error);
  }
}
