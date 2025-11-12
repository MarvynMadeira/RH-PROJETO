import { NextRequest, NextResponse } from 'next/server';
import { Admin } from '@/lib/database/models';
import { handleError } from '@/lib/errors/error-handler';
import { NotFoundError, ValidationError } from '@/lib/errors/AppError';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

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

    await admin.update({
      emailVerified: true,
      uniqueToken: null,
    });

    return NextResponse.json({
      success: true,
      message: 'Email verificado com sucesso!',
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest) {
  const loginUrl = new URL('/login', request.url);

  try {
    const token = request.nextUrl.searchParams.get('token');

    console.log('🔍 [VERIFY] Token:', token);

    if (!token) {
      loginUrl.searchParams.set('error', 'missing_token');
      return NextResponse.redirect(loginUrl);
    }

    const admin = await Admin.findOne({
      where: { uniqueToken: token },
      attributes: ['id', 'email', 'name', 'emailVerified', 'uniqueToken'],
    });

    console.log(
      '📋 [VERIFY] Admin encontrado:',
      admin
        ? {
            id: admin.get('id'),
            email: admin.get('email'),
            emailVerified: admin.get('emailVerified'),
          }
        : 'null',
    );

    if (!admin) {
      loginUrl.searchParams.set('error', 'invalid_token');
      return NextResponse.redirect(loginUrl);
    }

    if (admin.get('emailVerified') === true) {
      console.log('ℹ️ [VERIFY] Email já verificado');
      loginUrl.searchParams.set('message', 'already_verified');
      return NextResponse.redirect(loginUrl);
    }

    console.log('🔄 [VERIFY] Atualizando...');

    admin.set('emailVerified', true);
    admin.set('uniqueToken', null);
    await admin.save();

    console.log('✅ [VERIFY] Atualizado com sucesso!');

    loginUrl.searchParams.set('verified', 'true');
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error('❌ [VERIFY] Erro:', error);
    loginUrl.searchParams.set('error', 'server_error');
    return NextResponse.redirect(loginUrl);
  }
}
