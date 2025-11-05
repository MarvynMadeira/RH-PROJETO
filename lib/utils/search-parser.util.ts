import { Op } from 'sequelize';

interface SearchCondition {
  field: string;
  operator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';
  value: any;
}

export function parseSearchQuery(query: string): SearchCondition[] {
  const conditions: SearchCondition[] = [];

  const queryType = query.split(',').map((p) => p.trim());

  for (const q of queryType) {
    let tokens = q.split(/\s+/);

    if (tokens.length === 0) continue;

    let field = tokens[0];

    if (tokens.length === 1) {
      continue;
    }

    const values = tokens.slice(1);

    if (values.length === 1) {
      let value = values[0];

      let numValue = Number(value);
      if (!isNaN(numValue)) {
        conditions.push({
          field,
          operator: 'gte',
          value: numValue,
        });
      } else {
        conditions.push({
          field,
          operator: 'eq',
          value,
        });
      }
    } else {
      conditions.push({
        field,
        operator: 'in',
        value: values,
      });
    }
  }

  return conditions;
}

export function buildSequelizeWhere(conditions: SearchCondition[]): any {
  const where: any = {};

  for (const condition of conditions) {
    let fieldPath = `formData.${condition.field}`;

    switch (condition.operator) {
      case 'eq':
        where[fieldPath] = condition.value;
        break;
      case 'gte':
        where[fieldPath] = { [Op.gte]: condition.value };
        break;
      case 'gt':
        where[fieldPath] = { [Op.gt]: condition.value };
        break;
      case 'lte':
        where[fieldPath] = { [Op.lte]: condition.value };
        break;
      case 'lt':
        where[fieldPath] = { [Op.lt]: condition.value };
        break;
      case 'like':
        where[fieldPath] = { [Op.iLike]: `%${condition.value}%` };
        break;
      case 'in':
        where[fieldPath] = { [Op.in]: condition.value };
        break;
    }
  }

  return where;
}
