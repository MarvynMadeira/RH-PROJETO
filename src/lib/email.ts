import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendConfirmationEmail(
  email: string,
  token: string,
): Promise<void> {
  const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/confirmar-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Confirme seu email - RH Helper',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Bem-vindo ao RH Helper!</h2>
        <p>Por favor, confirme seu email clicando no botão abaixo:</p>
        <a href="${confirmUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; 
                  color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Confirmar Email
        </a>
        <p>Ou copie e cole este link no navegador:</p>
        <p style="color: #666; word-break: break-all;">${confirmUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Este link expira em 24 horas.
        </p>
      </div>
    `,
  });
}

export async function sendFormularioLink(
  email: string,
  link: string,
): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Link do Formulário de Cadastro - RH Helper',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Formulário de Cadastro</h2>
        <p>Use o link abaixo para acessar o formulário de cadastro:</p>
        <a href="${link}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; 
                  color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Acessar Formulário
        </a>
        <p>Ou copie e cole este link no navegador:</p>
        <p style="color: #666; word-break: break-all;">${link}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Este link expira em 7 dias.
        </p>
      </div>
    `,
  });
}

export async function sendRequisicaoLink(
  email: string,
  nome: string,
  link: string,
): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Nova Requisição - RH Helper',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Olá, ${nome}!</h2>
        <p>Você recebeu uma nova requisição para preencher:</p>
        <a href="${link}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; 
                  color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Responder Requisição
        </a>
        <p>Ou copie e cole este link no navegador:</p>
        <p style="color: #666; word-break: break-all;">${link}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Este link expira após ser usado uma vez.
        </p>
      </div>
    `,
  });
}
