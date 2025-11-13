import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    const supabase = createServerSupabaseClient();

    // Buscar token
    const { data: confirmation, error: fetchError } = await supabase
      .from('email_confirmations')
      .select('*')
      .eq('token', token)
      .eq('confirmed', false)
      .single();

    if (fetchError || !confirmation) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 },
      );
    }

    // Verificar expiração
    if (new Date(confirmation.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 400 });
    }

    // Marcar como confirmado
    const { error: updateError } = await supabase
      .from('email_confirmations')
      .update({ confirmed: true })
      .eq('id', confirmation.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Erro ao confirmar email' },
        { status: 500 },
      );
    }

    // Atualizar metadata do usuário no auth
    const { error: metadataError } = await supabase.auth.admin.updateUserById(
      confirmation.user_id,
      {
        email_confirmed_at: new Date().toISOString(),
      },
    );

    if (metadataError) {
      console.error('Erro ao atualizar metadata:', metadataError);
    }

    return NextResponse.json({
      message: 'Email confirmado com sucesso!',
    });
  } catch (error) {
    console.error('Erro na confirmação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
