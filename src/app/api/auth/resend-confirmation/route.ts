import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { sendConfirmationEmail } from '@/lib/email';
import { generateToken } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const supabase = createServerSupabaseClient();

    // Buscar usuário
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 },
      );
    }

    // Gerar novo token
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Deletar tokens anteriores
    await supabase
      .from('email_confirmations')
      .delete()
      .eq('user_id', user.id)
      .eq('confirmed', false);

    // Criar novo token
    const { error: tokenError } = await supabase
      .from('email_confirmations')
      .insert({
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      return NextResponse.json(
        { error: 'Erro ao criar token' },
        { status: 500 },
      );
    }

    // Enviar email
    await sendConfirmationEmail(email, token);

    return NextResponse.json({
      message: 'Email de confirmação reenviado!',
    });
  } catch (error) {
    console.error('Erro ao reenviar:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
