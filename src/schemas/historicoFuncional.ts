import { z } from 'zod';

const movimentacaoSchema = z.object({
  escolaSetorUnidade: z.string().min(1, 'Escola/setor/unidade obrigatória'),
  data: z.string().min(1, 'Data obrigatória'),
});

const alteracaoCargaHorariaSchema = z.object({
  de: z.number().min(1, 'Carga horária inicial obrigatória'),
  para: z.number().min(1, 'Nova carga horária obrigatória'),
  dataAlteracao: z.string().min(1, 'Data de alteração obrigatória'),
});

export const historicoFuncionalSchema = z.object({
  movimentacoes: z.array(movimentacaoSchema).optional(),
  alteracaoCargaHoraria: z.array(alteracaoCargaHorariaSchema).optional(),
});

export type HistoricoFuncionalData = z.infer<typeof historicoFuncionalSchema>;
