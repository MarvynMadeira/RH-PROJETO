import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth.middleware';
import { FieldLink, CustomField, Associate } from '@/lib/database/models';
import { generateLinkToken } from '@/lib/utils/token.util';
import { sendFieldLink } from '@/lib/utils/email.util';
import { handleError } from '@/lib/errors/error-handler';
import { NotFoundError, ValidationError } from '@/lib/errors/AppError';
import { Op } from 'sequelize';

export async function POST(request: NextRequest) {
  try {
    let admin = requireAdmin(request);

    const { customFieldId, associateIds, expiresInDays } =
      (await request.json()) as {
        customFieldId: string;
        associateIds: string[];
        expiresInDays?: number;
      };

    if (
      !customFieldId ||
      !Array.isArray(associateIds) ||
      associateIds.length === 0
    ) {
      throw new ValidationError(
        'customFieldId e associateIds (array) são obrigatórios',
      );
    }

    const days = Number(expiresInDays) || 7;
    if (days <= 0 || days > 365) {
      throw new ValidationError(
        'O prazo de expiração deve ser entre 1 e 365 dias.',
      );
    }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    const field = await CustomField.findOne({
      where: { id: customFieldId, adminId: admin.id },
    });

    if (!field) {
      throw new NotFoundError(
        'Campo customizado não encontrado ou inacessível.',
      );
    }

    const associates = await Associate.findAll({
      where: {
        id: { [Op.in]: associateIds },
        adminId: admin.id,
      },
    });

    if (associates.length === 0) {
      return NextResponse.json({
        success: true,
        links: [],
        expiresAt,
        message: 'Nenhum associado encontrado ou autorizado.',
      });
    }

    const newLinksData = associates.map((associate) => {
      let token = generateLinkToken();

      let url = `${process.env.NEXT_PUBLIC_APP_URL}/associate/field/${token}`;

      return {
        adminId: admin.id,
        customFieldId,
        associateId: associate.id,
        token,
        expiresAt,
        _url: url,
        _email: (associate.formData as any).dadosPessoais?.contato?.email,
        _username: associate.username,
      };
    });

    await FieldLink.bulkCreate(
      newLinksData.map((d) => ({
        adminId: d.adminId,
        customFieldId: d.customFieldId,
        associateId: d.associateId,
        token: d.token,
        expiresAt: d.expiresAt,
      })),
    );

    let linksResponse = [];
    for (const linkData of newLinksData) {
      if (linkData._email) {
        try {
          await sendFieldLink(
            linkData._email,
            linkData._url,
            field.fieldLabel,
            linkData._username || 'Associado',
          );
        } catch (error) {
          console.error(`Erro ao enviar email para ${linkData._email}:`, error);
        }
      }

      linksResponse.push({
        associateId: linkData.associateId,
        username: linkData._username,
        url: linkData._url,
      });
    }

    return NextResponse.json({
      success: true,
      links: linksResponse,
      expiresAt,
    });
  } catch (error) {
    return handleError(error);
  }
}
