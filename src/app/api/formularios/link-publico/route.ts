import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateToken } from '@/lib/utils';

// POST - Gerar novo link público
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

    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias

    const { data, error } = await supabase
      .from('formulario_links')
      .insert({
        admin_id: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const link = `${process.env.NEXT_PUBLIC_APP_URL}/formulario-publico/${token}`;

    return NextResponse.json({
      link,
      token,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Erro ao gerar link:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

// GET - Verificar link público
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token necessário' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('formulario_links')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Link inválido ou expirado', valid: false },
        { status: 404 },
      );
    }

    if (new Date(data.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Link expirado', valid: false },
        { status: 400 },
      );
    }

    return NextResponse.json({ valid: true, adminId: data.admin_id });
  } catch (error) {
    console.error('Erro ao verificar link:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
