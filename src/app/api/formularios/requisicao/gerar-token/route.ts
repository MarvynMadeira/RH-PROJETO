import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateToken } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { requisicaoId, associadoIds } = await request.json();

    if (!requisicaoId || !associadoIds || !Array.isArray(associadoIds)) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const tokens = [];

    for (const associadoId of associadoIds) {
      const token = generateToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { data, error } = await supabase
        .from('requisicao_tokens')
        .insert({
          requisicao_id: requisicaoId,
          associado_id: associadoId,
          token,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar token:', error);
        continue;
      }

      tokens.push({
        associadoId,
        token,
        link: `${process.env.NEXT_PUBLIC_APP_URL}/requisicao/${token}`,
        expiresAt: expiresAt.toISOString(),
      });
    }

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('Erro ao gerar tokens:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
