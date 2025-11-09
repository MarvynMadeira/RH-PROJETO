import { NextRequest, NextResponse } from 'next/server';
import { Admin } from '@/lib/database/models';
import { handleError } from '@/lib/errors/error-handler';
import { NotFoundError, ValidationError } from '@/lib/errors/AppError';

export async function POST(request: NextRequest) {
  try {
    let { token } = await request.json();

    if (!token) {
      throw new ValidationError('Token não fornecido');
    }

    const admin = await Admin.findOne({
      where: { uniqueToken: token },
    });

    if (!admin) {
      throw new NotFoundError('Token inválido');
    }

    if (admin.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Email já verificado',
      });
    }

    await admin.update({ emailVerified: true });

    return NextResponse.json({
      success: true,
      message: 'Email verificado com sucesso!',
    });
  } catch (error) {
    return handleError(error);
  }
}
