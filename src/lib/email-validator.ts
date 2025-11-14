interface ParsedEmail {
  user: string;
  domain: string;
  original: string;
  normalized: string;
}

export function parseEmail(email: string): ParsedEmail {
  const emailLower = email.toLowerCase().trim();

  if (emailLower.includes('+')) {
    let [userComAlias] = emailLower.split('+');
    let [, domainComAlias] = emailLower.split('@');

    let domain = domainComAlias;
    let user = userComAlias;

    return {
      user,
      domain,
      original: emailLower,
      normalized: `${user}@${domain}`,
    };
  }

  const [user, domain] = emailLower.split('@');

  return {
    user,
    domain,
    original: emailLower,
    normalized: emailLower,
  };
}

export function compareEmail(email1: string, email2: string): boolean {
  let email1Parsed = parseEmail(email1);
  let email2Parsed = parseEmail(email2);

  return (
    email1Parsed.user === email2Parsed.user &&
    email1Parsed.domain === email2Parsed.domain
  );
}

export function normalizeEmail(email: string): string {
  return parseEmail(email).normalized;
}

export function normalizeGmail(email: string): string {
  const parsed = parseEmail(email);

  if (parsed.domain === 'gmail.com' || parsed.domain === 'googlemail.com') {
    const userSemPontos = parsed.user.replace(/\./g, '');
    return `${userSemPontos}@gmail.com`;
  }

  return parsed.normalized;
}

// Adaptado para Supabase
export async function checkEmailDuplicate(
  email: string,
  supabase: any,
  excludeUserId?: string,
): Promise<{ exists: boolean; normalizedEmail: string }> {
  const normalizedEmail = normalizeGmail(email);

  // Buscar no Supabase Auth
  const { data: users, error } = await supabase.auth.admin.listUsers();

  if (error) {
    throw new Error('Erro ao verificar duplicatas de email');
  }

  const exists = users.users.some((user: any) => {
    // Pular o próprio usuário se estiver editando
    if (excludeUserId && user.id === excludeUserId) {
      return false;
    }

    // Comparar emails normalizados
    const userNormalizedEmail = normalizeGmail(user.email);
    return userNormalizedEmail === normalizedEmail;
  });

  return {
    exists,
    normalizedEmail,
  };
}
