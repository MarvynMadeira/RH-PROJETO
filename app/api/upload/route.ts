import { NextRequest, NextResponse } from 'next/server';
import { saveFormFile } from '@/lib/utils/file.util';
import { handleError } from '@/lib/errors/error-handler';
import { ValidationError, FileTooLargeError } from '@/lib/errors/AppError';

export async function POST(request: NextRequest) {
  try {
    let formData = await request.formData();
    let file = formData.get('file') as File;
    let folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      throw new ValidationError('Arquivo não enviado');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new FileTooLargeError('5MB');
    }

    const allowerdMimeTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowerdMimeTypes.includes(file.type)) {
      throw new ValidationError(
        'Tipo de arquivo não permitido. Apenas JPG, PNG, PDF ou DOCX são aceitos.',
      );
    }

    let filepath = await saveFormFile(file, folder);

    return NextResponse.json({
      success: true,
      filepath,
      url: `${process.env.NEXT_PUBLIC_APP_URL}${filepath}`,
    });
  } catch (error) {
    return handleError(error);
  }
}
