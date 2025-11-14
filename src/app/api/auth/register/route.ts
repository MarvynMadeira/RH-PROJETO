import { NextRequest, NextResponse } from 'next/server';
import { createRouteSupabaseClient } from '@/lib/supabase/route';
import { sendConfirmationEmail } from '@/lib/email';
import { generateSecureToken } from '@/lib/security';
import { checkEmailDuplicate, normalizeGmail } from '@/lib/email-validator';
import { getClientIP, rateLimiters } from '@/lib/rate-limiter';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    // -------------------------------
    // 1. Ler corpo da requisição
    // -------------------------------
    const { email, password, nome } = await request.json();

    if (!email || !password || !nome) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 },
      );
    }

    if (nome.length < 3) {
      return NextResponse.json(
        { error: 'Nome deve ter pelo menos 3 caracteres' },
        { status: 400 },
      );
    }

    // Criar cliente Supabase
    const supabase = createRouteSupabaseClient();

    // -------------------------------
    // 2. Normalizar e validar duplicidade
    // -------------------------------
    const normalizedEmail = normalizeGmail(email);

    const { exists } = await checkEmailDuplicate(
      normalizedEmail,
      supabaseAdmin,
    );

    if (exists) {
      return NextResponse.json(
        {
          error:
            'Este email já está em uso. Se você já tem uma conta, faça login.',
        },
        { status: 409 },
      );
    }

    // Rate limit por email normalizado (evita spam)
    const emailLimit = rateLimiters.register.check(normalizedEmail);
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: 'Muitas tentativas com este email. Tente mais tarde.' },
        { status: 429 },
      );
    }

    // -------------------------------
    // 3. Criar usuário com o email normalizado
    // -------------------------------
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { nome },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Erro ao criar usuário.' },
        { status: 500 },
      );
    }

    // -------------------------------
    // 4. Criar token de confirmação
    // -------------------------------
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // +24h

    const { error: tokenError } = await supabaseAdmin
      .from('email_confirmations')
      .insert({
        user_id: authData.user.id,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error('Erro ao criar token de email:', tokenError);
    }

    // -------------------------------
    // 5. Envio de email com rate limit por IP
    // -------------------------------
    const ip = getClientIP(request);
    const emailSendLimit = rateLimiters.email.check(ip);

    if (emailSendLimit.allowed) {
      await sendConfirmationEmail(normalizedEmail, token);
    } else {
      console.warn('Rate limit de envio de email excedido para o IP:', ip);
    }

    // -------------------------------
    // 6. Resposta final
    // -------------------------------
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
