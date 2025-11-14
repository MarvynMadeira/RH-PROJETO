// Normaliza e-mails do Gmail (remove pontos e "+")
export function normalizeGmail(email: string): string {
  const [local, domain] = email.toLowerCase().split('@');

  if (domain !== 'gmail.com') return email.toLowerCase();

  return (
    local
      .replace(/\./g, '') // remove pontos
      .replace(/\+.*/, '') + // remove tudo após "+"
    '@gmail.com'
  );
}

/**
 * Verifica duplicidade de e-mail usando o Supabase Admin
 */
export async function checkEmailDuplicate(
  email: string,
  supabase: any,
  excludeUserId?: string,
): Promise<{ exists: boolean; normalizedEmail: string }> {
  const normalizedEmail = normalizeGmail(email);

  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('Erro Supabase Admin:', error);
      throw new Error('Erro ao consultar usuários do Supabase Admin');
    }

    const exists = users.users.some((user: any) => {
      if (excludeUserId && user.id === excludeUserId) return false;

      return normalizeGmail(user.email) === normalizedEmail;
    });

    return { exists, normalizedEmail };
  } catch (error) {
    console.error('ERRO CRÍTICO na checkEmailDuplicate:', error);
    throw new Error('Falha de sistema ao verificar duplicidade de email.');
  }
}
