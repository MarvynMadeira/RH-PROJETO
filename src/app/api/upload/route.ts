import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3';
import { validateFileSize, validateFileType } from '@/lib/security';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação (exceto para uploads de formulário público)
    const referer = request.headers.get('referer') || '';
    const isPublicForm =
      referer.includes('/formulario-publico/') ||
      referer.includes('/requisicao/');

    if (!isPublicForm) {
      const supabase = createServerSupabaseClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo necessário' },
        { status: 400 },
      );
    }

    // Validar tamanho (5MB)
    if (!validateFileSize(file, 5)) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo: 5MB' },
        { status: 400 },
      );
    }

    // Validar tipo
    if (!validateFileType(file)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use: JPG, PNG ou PDF' },
        { status: 400 },
      );
    }

    // Validar nome do arquivo (prevenir path traversal)
    const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = await uploadToS3(buffer, fileName, file.type);

    return NextResponse.json({
      key,
      fileName,
      fileType: file.type,
      fileSize: file.size,
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload' },
      { status: 500 },
    );
  }
}

// Adicionar limite de tamanho do body
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
};
