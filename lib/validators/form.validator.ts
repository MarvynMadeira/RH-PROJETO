import { z } from 'zod';

export const adminRegisterSchema = z.object({
  name: z
    .string('Nome é obrigatório')
    .nonempty('Nome é obrigatório')
    .min(3, 'Nome deve conter ao menos três letras'),

  email: z
    .string('Email é obrigatório')
    .nonempty('Email é obrigatório')
    .email('Email inválido'),

  password: z
    .string('Senha é obrigatória')
    .nonempty('Senha é obrigatória')
    .min(6, 'Senha deve conter ao menos seis caracteres'),

  cpfCnpj: z
    .string('CPF/CNPJ é obrigatório')
    .nonempty('CPF/CNPJ é obrigatório')
    .refine(
      (doc) => {
        const digits = doc.replace(/\D/g, '');
        return digits.length === 11 || digits.length === 14;
      },
      {
        message: 'CPF/CNPJ deve ter 11 ou 14 dígitos',
      },
    ),
});

export const loginSchema = z.object({
  email: z
    .string('Email é obrigatório')
    .nonempty('Email é obrigatório')
    .email('Email inválido'),

  password: z.string('Senha é obrigatória').nonempty('Senha é obrigatória'),
});

export const customFieldSchema = z.object({
  fieldLabel: z.string().min(1, 'Nome do campo é obrigatório'),
  fieldKey: z.string().min(1, 'A chave do campo é obrigatória'),
  description: z.string().optional(),
  fieldType: z.enum([
    'text',
    'number',
    'date',
    'file',
    'dropdown',
    'multiselect',
  ]),
  isRequired: z.boolean().default(false),
  options: z.array(z.string()).optional(),
});

export const formSchema = z.object({
  name: z.string().min(1, 'Nome do formulário é obrigatório'),
  description: z.string().optional(),
  surveyJson: z.object({}).passthrough(),
});
