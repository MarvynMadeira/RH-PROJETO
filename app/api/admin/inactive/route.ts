import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth.middleware';
import { Associate } from '@/lib/database/models';
import { handleError } from '@/lib/errors/error-handler';

export async function GET(request: NextRequest) {
  try {
    let admin = requireAdmin(request);

    const inactives = await Associate.findAll({
      where: {
        adminId: admin.id,
        status: 'inactive',
      },
      order: [['updatedAt', 'DESC']],
    });

    return NextResponse.json({
      total: inactives.length,
      inactives: inactives.map((a) => ({
        id: a.id,
        username: a.username,
        formData: a.formData,
        inactiveReason: a.inactiveReason,
        inactiveFile: a.inactiveFile,
        updatedAt: a.updatedAt,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
}
