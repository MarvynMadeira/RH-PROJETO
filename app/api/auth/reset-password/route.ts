import { NextRequest, NextResponse } from 'next/server';
import { Admin } from '@/lib/database/models';
import { sendPasswordResetEmail } from '@/lib/utils/email.util';
import { generateLinkToken } from '@/lib/utils/token.util';
import { handleError } from '@/lib/errors/error-handler';
import { NotFoundError } from '@/lib/errors/AppError';

export async function POST(request: NextRequest) {
  try {
    let { email } = await request.json();

    let admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return NextResponse.json({
        success: true,
        message: 'Se o email existir, um link de recuperação será enviado.',
      });
    }

    let resetToken = generateLinkToken();

    await sendPasswordResetEmail(admin.email, resetToken);

    return NextResponse.json({
      success: true,
      message: 'Link de recuperação enviado para seu email',
    });
  } catch (error) {
    return handleError(error);
  }
}
