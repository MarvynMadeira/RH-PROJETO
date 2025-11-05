import {
  parseSearchQuery,
  buildSequelizeWhere,
} from '@/lib/utils/search-parser.util';

import { Op } from 'sequelize';

describe('Search Parser Utils', () => {
  describe('parseSearchQuery', () => {
    it('deve parsear busca simples com texto', () => {
      const result = parseSearchQuery('nome João');
      expect(result).toEqual([
        { field: 'nome', operator: 'eq', value: 'João' },
      ]);
    });

    it('deve parsear busca numérica com >=', () => {
      const result = parseSearchQuery('matricula 2');
      expect(result).toEqual([
        { field: 'matricula', operator: 'gte', value: 2 },
      ]);
    });

    it('deve parsear múltiplos campos', () => {
      const result = parseSearchQuery('nome João, status ativo');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        field: 'nome',
        operator: 'eq',
        value: 'João',
      });
      expect(result[1]).toEqual({
        field: 'status',
        operator: 'eq',
        value: 'ativo',
      });
    });

    it('deve parsear múltiplos valores como IN', () => {
      const result = parseSearchQuery('cargo professor coordenador');
      expect(result).toEqual([
        { field: 'cargo', operator: 'in', value: ['professor', 'coordenador'] },
      ]);
    });

    it('deve ignorar campos vazios', () => {
      const result = parseSearchQuery('nome, , status ativo');
      expect(result).toHaveLength(1);
    });

    it('deve lidar com espaços extras', () => {
      const result = parseSearchQuery('  nome   João  ,  status   ativo  ');
      expect(result).toHaveLength(2);
    });

    it('deve parsear números decimais', () => {
      const result = parseSearchQuery('salario 5000.50');
      expect(result[0].value).toBe(5000.5);
    });

    it('deve detectar valores numéricos mesmo com texto depois', () => {
      const result = parseSearchQuery('idade 25');
      expect(result[0].operator).toBe('gte');
      expect(result[0].value).toBe(25);
    });
  });

  describe('buildSequelizeWhere', () => {
    it('deve construir WHERE com operador eq', () => {
      const conditions = [
        { field: 'nome', operator: 'eq' as const, value: 'João' },
      ];
      const where = buildSequelizeWhere(conditions);
      expect(where['formData.nome']).toBe('João');
    });

    it('deve construir WHERE com operador gte', () => {
      const conditions = [
        { field: 'matricula', operator: 'gte' as const, value: 100 },
      ];
      const where = buildSequelizeWhere(conditions);
      expect(where['formData.matricula']).toEqual({ [Op.gte]: 100 });
    });

    it('deve construir WHERE com operador in', () => {
      const conditions = [
        {
          field: 'status',
          operator: 'in' as const,
          value: ['ativo', 'inativo'],
        },
      ];
      const where = buildSequelizeWhere(conditions);
      expect(where['formData.status']).toEqual({
        [Op.in]: ['ativo', 'inativo'],
      });
    });

    it('deve construir WHERE com múltiplas condições', () => {
      const conditions = [
        { field: 'nome', operator: 'eq' as const, value: 'João' },
        { field: 'idade', operator: 'gte' as const, value: 18 },
      ];
      const where = buildSequelizeWhere(conditions);
      expect(where['formData.nome']).toBe('João');
      expect(where['formData.idade']).toEqual({ [Op.gte]: 18 });
    });

    it('deve usar busca em JSONB (formData.campo)', () => {
      const conditions = [
        { field: 'cargo', operator: 'eq' as const, value: 'professor' },
      ];
      const where = buildSequelizeWhere(conditions);
      expect(Object.keys(where)[0]).toBe('formData.cargo');
    });
  });

  describe('Integração parseSearchQuery + buildSequelizeWhere', () => {
    it('deve processar query completa', () => {
      const query = 'nome João, idade 25, status ativo inativo';
      const conditions = parseSearchQuery(query);
      const where = buildSequelizeWhere(conditions);

      expect(where['formData.nome']).toBe('João');
      expect(where['formData.idade']).toEqual({ [Op.gte]: 25 });
      expect(where['formData.status']).toEqual({
        [Op.in]: ['ativo', 'inativo'],
      });
    });
  });

  describe('Casos de uso reais', () => {
    it('deve buscar professores de geografia e português', () => {
      const query = 'cargo professor, disciplina geografia portugues';
      const conditions = parseSearchQuery(query);
      const where = buildSequelizeWhere(conditions);

      expect(where['formData.cargo']).toBe('professor');
      expect(where['formData.disciplina']).toEqual({
        [Op.in]: ['geografia', 'portugues'],
      });
    });

    it('deve buscar matrícula maior ou igual a 1000', () => {
      const query = 'matricula 1000';
      const conditions = parseSearchQuery(query);
      const where = buildSequelizeWhere(conditions);

      expect(where['formData.matricula']).toEqual({ [Op.gte]: 1000 });
    });

    it('deve buscar múltiplos status', () => {
      const query = 'status ativo ferias afastado';
      const conditions = parseSearchQuery(query);
      const where = buildSequelizeWhere(conditions);

      expect(where['formData.status']).toEqual({
        [Op.in]: ['ativo', 'ferias', 'afastado'],
      });
    });
  });
});
