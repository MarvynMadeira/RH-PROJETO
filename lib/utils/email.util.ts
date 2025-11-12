import nodemailer, { Transporter } from 'nodemailer';

let emailTransporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!emailTransporter) {
    emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return emailTransporter;
}

export async function sendVerificationEmail(
  email: string,
  token: string,
): Promise<void> {
  let transporter = getTransporter();

  let verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: '✓ Verifique seu email - RH Helper',
    html: `
    <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9fafb; }
            .button { 
              display: inline-block; 
              padding: 12px 30px; 
              background: #4F46E5; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Bem-vindo ao RH Helper!</h1>
            </div>
            <div class="content">
              <p>Obrigado por se cadastrar. Clique no botão abaixo para verificar seu email:</p>
              <a href="${verifyUrl}" class="button">Verificar Email</a>
              <p>Ou copie e cole este link no navegador:</p>
              <p>${verifyUrl}</p>
              <p><small>Este link expira em 24 horas.</small></p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendAssociateCredentials(
  email: string,
  username: string,
  password: string,
): Promise<void> {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: '🔐 Suas Credenciais de Acesso - RH Helper',
    html: `
    <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 30px; }
            .credentials { 
              background: white; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0; 
              border-left: 4px solid #4F46E5;
            }
            .credential-item { margin: 15px 0; }
            .credential-label { 
              font-weight: bold; 
              color: #6b7280; 
              font-size: 12px; 
              text-transform: uppercase;
            }
            .credential-value { 
              font-size: 18px; 
              font-family: 'Courier New', monospace; 
              background: #f3f4f6; 
              padding: 8px 12px; 
              border-radius: 4px; 
              display: inline-block;
              margin-top: 5px;
            }
            .warning { 
              background: #fef3c7; 
              border-left: 4px solid #f59e0b; 
              padding: 15px; 
              margin: 20px 0; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Cadastro Realizado!</h1>
            </div>
            <div class="content">
              <p>Seu cadastro foi realizado com sucesso!</p>
              
              <p>Suas credenciais de acesso ao sistema:</p>
              
              <div class="credentials">
                <div class="credential-item">
                  <div class="credential-label">Usuário</div>
                  <div class="credential-value">${username}</div>
                </div>
                
                <div class="credential-item">
                  <div class="credential-label">Senha</div>
                  <div class="credential-value">${password}</div>
                </div>
              </div>
              
              <div class="warning">
                <strong>⚠️ IMPORTANTE:</strong>
                <ul>
                  <li>Guarde essas informações em local seguro</li>
                  <li>Não compartilhe sua senha com ninguém</li>
                  <li>Você só poderá acessar quando o administrador enviar um link ativo</li>
                </ul>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendFormLink(
  email: string,
  link: string,
  formName: string,
  adminName: string,
): Promise<void> {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `📋 ${adminName} enviou um formulário para você`,
    html: `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Novo Formulário</h1>
          <p>${adminName} está solicitando que você preencha o formulário: <strong>${formName}</strong></p>
          <p><a href="${link}" style="padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Acessar Formulário</a></p>
          <p><small>Este link expira em 7 dias.</small></p>
        </body>
      </html>
    `,
  });
}

export async function sendFieldLink(
  email: string,
  link: string,
  fieldLabel: string,
  adminName: string,
): Promise<void> {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `📝 ${adminName} - ${fieldLabel}`,
    html: `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Nova Informação Solicitada</h1>
          <p>${adminName} está solicitando que você preencha o seguinte campo:</p>
          <p><strong>${fieldLabel}</strong></p>
          <p><a href="${link}" style="padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Preencher Campo</a></p>
          <p><small>Este link expira em 7 dias.</small></p>
        </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
): Promise<void> {
  const transporter = getTransporter();

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: '🔑 Redefinir Senha - RH Helper',
    html: `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Redefinir Senha</h1>
          <p>Você solicitou a redefinição de senha. Clique no link abaixo:</p>
          <p><a href="${resetUrl}" style="padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Redefinir Senha</a></p>
          <p><small>Este link expira em 1 hora.</small></p>
          <p>Se você não solicitou, ignore este email.</p>
        </body>
      </html>
    `,
  });
}
