import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth.middleware';
import { Form } from '@/lib/database/models';
import { formSchema } from '@/lib/validators/form.validator';
import { handleError } from '@/lib/errors/error-handler';

export async function GET(request: NextRequest) {
  try {
    let admin = requireAdmin(request);

    let forms = await Form.findAll({
      where: { adminId: admin.id, isActive: true },
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({ forms });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    let admin = requireAdmin(request);
    let body = await request.json();

    let validateData = formSchema.parse(body);

    const form = await Form.create({
      adminId: admin.id,
      name: validateData.name,
      description: validateData.description,
      surveyJson: validateData.surveyJson,
    });

    return NextResponse.json(
      {
        success: true,
        form: {
          id: form.id,
          name: form.name,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
