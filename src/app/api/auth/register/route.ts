import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { sendConfirmationEmail } from '@/lib/email';
import { generateSecureToken } from '@/lib/security';
import { checkEmailDuplicate, normalizeGmail } from '@/lib/email-validator';
import { getClientIP, rateLimiters } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting já aplicado no middleware, mas podemos adicionar por email também
    const { email, password, nome } = await request.json();

    // Validações de segurança
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

    const supabase = createServerSupabaseClient();

    // Normalizar email e verificar duplicata
    const normalizedEmail = normalizeGmail(email);
    const { exists } = await checkEmailDuplicate(email, supabase);

    if (exists) {
      return NextResponse.json(
        {
          error:
            'Este email já está em uso. Se você já tem uma conta, faça login.',
        },
        { status: 409 },
      );
    }

    // Rate limit adicional por email normalizado
    const emailLimit = rateLimiters.register.check(normalizedEmail);
    if (!emailLimit.allowed) {
      return NextResponse.json(
        {
          error:
            'Muitas tentativas com este email. Tente novamente mais tarde.',
        },
        { status: 429 },
      );
    }

    // Criar usuário com email normalizado
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
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

    // Criar token de confirmação seguro
    const token = generateSecureToken();
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

    // Rate limit para envio de email
    const ip = getClientIP(request);
    const emailSendLimit = rateLimiters.email.check(ip);

    if (emailSendLimit.allowed) {
      // Enviar email
      await sendConfirmationEmail(normalizedEmail, token);
    } else {
      console.warn('Rate limit de email excedido para IP:', ip);
    }

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
