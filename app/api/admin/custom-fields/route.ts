import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth.middleware';
import { CustomField } from '@/lib/database/models';
import { customFieldSchema } from '@/lib/validators/form.validator';
import { handleError } from '@/lib/errors/error-handler';
import { ValidationError, ConflictError } from '@/lib/errors/AppError';

export async function POST(request: NextRequest) {
  try {
    let admin = requireAdmin(request);
    let body = await request.json();

    let validatedData = customFieldSchema.parse(body);

    const existing = await CustomField.findOne({
      where: { adminId: admin.id, fieldKey: validatedData.fieldKey },
    });

    if (existing) {
      throw new ConflictError('Já existe um campo com esta chave');
    }

    if (
      (validatedData.fieldType === 'dropdown' ||
        validatedData.fieldType === 'multiselect') &&
      (!validatedData.options || validatedData.options.length === 0)
    ) {
      throw new ValidationError('Campos de seleção precisam de opções');
    }

    const field = await CustomField.create({
      adminId: admin.id,
      fieldKey: validatedData.fieldKey,
      fieldLabel: validatedData.fieldLabel,
      description: validatedData.description,
      fieldType: validatedData.fieldType,
      isRequired: validatedData.isRequired,
      options: validatedData.options || null,
    });

    return NextResponse.json(
      {
        success: true,
        field: {
          id: field.id,
          fieldKey: field.fieldKey,
          fieldLabel: field.fieldLabel,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    let admin = requireAdmin(request);

    const fields = await CustomField.findAll({
      where: { adminId: admin.id },
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({ fields });
  } catch (error) {
    return handleError(error);
  }
}
