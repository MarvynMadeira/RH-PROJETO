import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth.middleware';
import { Associate } from '@/lib/database/models';
import { handleError } from '@/lib/errors/error-handler';

export async function GET(request: NextRequest) {
  try {
    const admin = requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';

    const associates = await Associate.findAll({
      where: {
        adminId: admin.id,
        status: status as 'active' | 'inactive',
      },
      order: [['createdAt', 'DESC']],
      limit: 1000,
    });

    return NextResponse.json({
      total: associates.length,
      associates: associates.map((a) => ({
        id: a.id,
        username: a.username,
        formData: a.formData,
        status: a.status,
        createdAt: a.createdAt,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
}
