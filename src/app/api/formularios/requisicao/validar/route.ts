import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cleanCPF } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { token, cpf } = await request.json();

    if (!token || !cpf) {
      return NextResponse.json(
        { error: 'Token e CPF necessários' },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();

    // Buscar token
    const { data: tokenData, error: tokenError } = await supabase
      .from('requisicao_tokens')
      .select(
        `
        *,
        associado:associados(id, dados_pessoais),
        requisicao:requisicoes(nome, descricao, survey_json)
      `,
      )
      .eq('token', token)
      .eq('respondido', false)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Token inválido ou já utilizado', valid: false },
        { status: 404 },
      );
    }

    // Verificar expiração
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Token expirado', valid: false },
        { status: 400 },
      );
    }

    // Validar CPF
    const cpfAssociado = cleanCPF(tokenData.associado.dados_pessoais.cpf);
    const cpfInformado = cleanCPF(cpf);

    if (cpfAssociado !== cpfInformado) {
      return NextResponse.json(
        { error: 'CPF não corresponde ao associado', valid: false },
        { status: 403 },
      );
    }

    return NextResponse.json({
      valid: true,
      requisicao: tokenData.requisicao,
      associado: {
        id: tokenData.associado.id,
        nome: tokenData.associado.dados_pessoais.nomeCompleto,
      },
    });
  } catch (error) {
    console.error('Erro ao validar requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
