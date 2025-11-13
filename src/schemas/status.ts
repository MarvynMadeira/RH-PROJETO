import { z } from 'zod';

const periodoAvaliacaoSchema = z.object({
  data: z.string().min(1, 'Data obrigatória'),
  observacoes: z.string().optional(),
});

export const statusSchema = z.object({
  estagioProbatorio: z.enum([
    'aprovado',
    'em_andamento',
    'reprovado',
    'suspenso',
  ]),
  periodosAvaliacoes: z.array(periodoAvaliacaoSchema).optional(),
  estadoAtual: z.enum(['vinculado', 'desvinculado']),
  desvinculacao: z
    .object({
      data: z.string().min(1, 'Data obrigatória'),
      observacoes: z.string().min(1, 'Observações obrigatórias'),
      arquivo: z.instanceof(File).optional(),
    })
    .optional(),
});

export type StatusData = z.infer<typeof statusSchema>;
