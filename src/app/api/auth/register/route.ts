import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { sendConfirmationEmail } from '@/lib/email';
import { generateToken } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password, nome } = await request.json();

    const supabase = createServerSupabaseClient();

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Erro ao criar usuário' },
        { status: 500 },
      );
    }

    // Criar token de confirmação
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { error: tokenError } = await supabase
      .from('email_confirmations')
      .insert({
        user_id: authData.user.id,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error('Erro ao criar token:', tokenError);
    }

    // Enviar email
    await sendConfirmationEmail(email, token);

    return NextResponse.json({
      message: 'Registro criado! Verifique seu email para confirmar.',
      userId: authData.user.id,
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
