import { NextRequest, NextResponse } from 'next/server';
import { Admin, Associate } from '@/lib/database/models';
import { loginSchema } from '@/lib/validators/form.validator';
import { verifyPassword } from '@/lib/utils/password.util';
import { generateToken } from '@/lib/middleware/auth.middleware';
import { handleError } from '@/lib/errors/error-handler';
import { UnauthorizedError, ValidationError } from '@/lib/errors/AppError';

export async function POST(request: NextRequest) {
  try {
    let body = await request.json();

    let validatedData = loginSchema.parse(body);

    const admin = await Admin.findOne({
      where: { email: validatedData.email },
    });

    if (admin) {
      const isValidPassword = await verifyPassword(
        validatedData.password,
        admin.password,
      );

      if (!isValidPassword) {
        throw new UnauthorizedError('Email ou senha incorretos');
      }

      const token = generateToken({
        id: admin.id,
        email: admin.email,
        type: 'admin',
      });

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          type: 'admin',
        },
      });
    }

    const associate = await Associate.findOne({
      where: { username: validatedData.email },
    });

    if (associate) {
      const isValidPassword = await verifyPassword(
        validatedData.password,
        associate.password,
      );

      if (!isValidPassword) {
        throw new UnauthorizedError('Usuário ou senha incorretos');
      }

      if (associate.status === 'inactive') {
        throw new UnauthorizedError(
          'Você está desvinculado com a instituição a qual pertencia.',
        );
      }

      const token = generateToken({
        id: associate.id,
        username: associate.username,
        type: 'associate',
      });

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: associate.id,
          username: associate.username,
          type: 'associate',
        },
      });
    }

    throw new UnauthorizedError('Email/usuário ou senha incorretos');
  } catch (error) {
    return handleError(error);
  }
}
