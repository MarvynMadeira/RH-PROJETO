import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth.middleware';
import { Associate } from '@/lib/database/models';
import {
  parseSearchQuery,
  buildSequelizeWhere,
} from '@/lib/utils/search-parser.util';
import { handleError } from '@/lib/errors/error-handler';
import { ValidationError } from '@/lib/errors/AppError';

export async function POST(request: NextRequest) {
  try {
    const admin = requireAdmin(request);
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      throw new ValidationError('Query de busca é obrigatória');
    }

    const conditions = parseSearchQuery(query);

    const where = buildSequelizeWhere(conditions);

    const associates = await Associate.findAll({
      where: {
        adminId: admin.id,
        status: 'active',
        ...where,
      },
      order: [['createdAt', 'DESC']],
      limit: 1000,
    });

    return NextResponse.json({
      total: associates.length,
      query,
      results: associates.map((a) => ({
        id: a.id,
        username: a.username,
        formData: a.formData,
        createdAt: a.createdAt,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
}
