import { NextRequest, NextResponse } from 'next/server';
import { FormLink, Associate, Form } from '@/lib/database/models';
import { generateUsername, generatePassword } from '@/lib/utils/token.util';
import { hashPassword } from '@/lib/utils/password.util';
import { sendAssociateCredentials } from '@/lib/utils/email.util';
import { saveDoc } from '@/lib/utils/file.util';
import { handleError } from '@/lib/errors/error-handler';
import { TokenExpiredError, NotFoundError } from '@/lib/errors/AppError';

export async function POST(request: NextRequest) {
  try {
    let body = await request.json();
    let { token, formData } = body;

    const link = await FormLink.findOne({
      where: { token, isActive: true },
      include: [{ model: Form, as: 'form' }],
    });

    if (!link) {
      throw new NotFoundError('Link');
    }

    if (new Date() > link.expiresAt) {
      throw new TokenExpiredError();
    }

    let processedFormData = await processUploads(formData);

    let username = generateUsername('assoc');
    let password = generatePassword();
    let hashedPassword = await hashPassword(password);

    const associate = await Associate.create({
      adminId: link.adminId,
      formId: link.formId,
      username,
      password: hashedPassword,
      formData: processedFormData,
      status: 'active',
    });

    let email = formData?.dadosPessoais?.contato?.email;
    let emailSent = false;

    if (email) {
      try {
        await sendAssociateCredentials(email, username, password);
        emailSent = true;
      } catch (error) {
        console.error('Erro ao enviar email:', error);
      }
    }

    const credentials = {
      username,
      password: !emailSent ? password : undefined,
    };

    return NextResponse.json({
      success: true,
      credentials,
      emailSent,
      message: emailSent
        ? 'Cadastro realizado! Verifique seu email com as credenciais.'
        : 'Cadastro realizado! Anote suas credenciais abaixo.',
    });
  } catch (error) {
    return handleError(error);
  }
}

async function processUploads(formData: any): Promise<any> {
  let processed = JSON.parse(JSON.stringify(formData));

  async function processObject(obj: any, path: string = ''): Promise<void> {
    for (const [key, value] of Object.entries(obj)) {
      let currentPath = path ? `${path}.${key}` : key;

      if (typeof value === 'string' && value.startsWith('data:')) {
        try {
          const filePath = await saveDoc(value, key, 'associates');
          obj[key] = filePath;
        } catch (error) {
          console.error(`Erro ao salvar arquivo ${currentPath}:`, error);
        }
      } else if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          if (typeof value[i] === 'object' && value[i] !== null) {
            await processObject(value[i], `${currentPath}[${i}]`);
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        await processObject(value, currentPath);
      }
    }
  }

  await processObject(processed);
  return processed;
}
