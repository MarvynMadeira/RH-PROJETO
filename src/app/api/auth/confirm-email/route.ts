// /src/app/api/auth/confirm-email/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  let body;
  // 1. Tentar fazer o parse do corpo da requisição
  try {
    body = await request.json();
  } catch (e) {
    // Retorna erro 400 se o corpo não for JSON válido
    return NextResponse.json(
      { error: 'Corpo da requisição inválido (JSON esperado)' },
      { status: 400 },
    );
  }

  const { token } = body;

  // 2. Validar se o token existe e é uma string
  if (typeof token !== 'string' || !token) {
    return NextResponse.json(
      { error: 'Token não fornecido ou inválido' },
      { status: 400 },
    );
  }

  // O restante do fluxo de confirmação
  try {
    const supabase = createServerSupabaseClient();

    // 3. Buscar token no banco de dados
    const { data: confirmation, error: fetchError } = await supabase
      .from('email_confirmations')
      .select('*')
      .eq('token', token)
      .eq('confirmed', false)
      .single();

    if (fetchError || !confirmation) {
      return NextResponse.json(
        { error: 'Token inválido ou já utilizado' },
        { status: 400 },
      );
    }

    // 4. Verificar expiração
    if (new Date(confirmation.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 400 });
    }

    // 5. Marcar token como confirmado no banco
    const { error: updateError } = await supabase
      .from('email_confirmations')
      .update({ confirmed: true })
      .eq('id', confirmation.id);

    if (updateError) {
      console.error('Erro ao atualizar registro de confirmação:', updateError);
      return NextResponse.json(
        { error: 'Erro ao processar confirmação' },
        { status: 500 },
      );
    }

    const { error: metadataError } = await supabase.auth.admin.updateUserById(
      confirmation.user_id,
      {
        email_confirm: true,
      },
    );

    if (metadataError) {
      console.error('Erro ao atualizar metadata do usuário:', metadataError);
    }

    return NextResponse.json({
      message: 'Email confirmado com sucesso!',
    });
  } catch (error) {
    console.error('Erro interno na confirmação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
