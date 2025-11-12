import { NextRequest, NextResponse } from 'next/server';
import { Admin } from '@/lib/database/models';
import { adminRegisterSchema } from '@/lib/validators/form.validator';
import { validateCPF } from '@/lib/validators/cpf.validator';
import { validateCNPJ } from '@/lib/validators/cnpj.validator';
import { checkEmailExists } from '@/lib/validators/email.validator';
import { hashPassword } from '@/lib/utils/password.util';
import { generateAdminToken } from '@/lib/utils/token.util';
import { sendVerificationEmail } from '@/lib/utils/email.util';
import { handleError } from '@/lib/errors/error-handler';
import { ValidationError, ConflictError } from '@/lib/errors/AppError';

export async function POST(request: NextRequest) {
  try {
    let body = await request.json();

    let validatedData = adminRegisterSchema.parse(body);

    const cleanedDoc = validatedData.cpfCnpj.replace(/\D/g, '');
    if (cleanedDoc.length === 11 && !validateCPF(validatedData.cpfCnpj)) {
      throw new ValidationError('CPF inválido');
    }
    if (cleanedDoc.length === 14 && !validateCNPJ(validatedData.cpfCnpj)) {
      throw new ValidationError('CNPJ inválido');
    }

    const { exists, normalizedEmail, existingRecord } = await checkEmailExists(
      validatedData.email,
      Admin,
    );

    if (exists) {
      if (existingRecord.email !== validatedData.email.toLocaleLowerCase()) {
        throw new ConflictError(
          `Este email já está cadastrado como: ${existingRecord.email}`,
        );
      }
      throw new ConflictError('Email já cadastrado');
    }

    let hashedPassword = await hashPassword(validatedData.password);

    let uniqueToken = generateAdminToken();

    const admin = await Admin.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      cpfCnpj: cleanedDoc,
      uniqueToken,
      emailVerified: false,
    });

    try {
      await sendVerificationEmail(validatedData.email, uniqueToken);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Cadastro realizado com sucesso. Verifique seu email.',
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
