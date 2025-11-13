import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const tipo = searchParams.get('tipo'); // 'nome', 'cpf', 'campo'

    if (!query) {
      return NextResponse.json({ error: 'Query necessária' }, { status: 400 });
    }

    let sqlQuery;

    if (tipo === 'cpf') {
      // Busca por CPF
      sqlQuery = supabase
        .from('associados')
        .select('*')
        .eq('admin_id', user.id)
        .eq('ativo', true)
        .ilike('dados_pessoais->>cpf', `%${query}%`);
    } else if (tipo === 'nome') {
      // Busca por nome
      sqlQuery = supabase
        .from('associados')
        .select('*')
        .eq('admin_id', user.id)
        .eq('ativo', true)
        .ilike('dados_pessoais->>nomeCompleto', `%${query}%`);
    } else {
      // Busca avançada - full text search
      sqlQuery = supabase
        .from('associados')
        .select('*')
        .eq('admin_id', user.id)
        .eq('ativo', true)
        .textSearch('dados_pessoais', query, {
          type: 'websearch',
          config: 'portuguese',
        });
    }

    const { data, error } = await sqlQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ associados: data });
  } catch (error) {
    console.error('Erro na busca:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
