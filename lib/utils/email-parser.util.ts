import { where } from 'sequelize';
import { Model } from 'survey-core';

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

export async function checkEmailDuplicate(
  email: string,
  model: any,
  excludeId?: string,
): Promise<{ exists: boolean; normalizedEmail: string }> {
  const normalizedEmail = normalizeGmail(email);

  let where: any = { email: normalizedEmail };

  if (excludeId) {
    where.id = { [model.sequelize.Op.ne]: excludeId };
  }
  const existing = await model.findOne({ where });

  return {
    exists: !!existing,
    normalizedEmail,
  };
}
