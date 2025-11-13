import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } },
) {
  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('requisicao_tokens')
      .update({
        respondido: true,
        respondido_em: new Date().toISOString(),
      })
      .eq('token', params.token);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Token marcado como respondido' });
  } catch (error) {
    console.error('Erro ao marcar token:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
