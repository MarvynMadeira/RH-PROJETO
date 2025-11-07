import { writeFile, mkdir, unlink, stat } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function saveDoc(
  base64Data: string,
  fieldName: string,
  folder: string = 'general',
): Promise<string> {
  const matches = base64Data.match(/^data:(.+);base64,(.+)$/);

  if (!matches) {
    throw new Error('Dados base64 inválidos');
  }

  let mimeType = matches[1];
  let data = matches[2];

  let extension = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'bin';

  let timestamp = Date.now();
  let random = Math.random().toString(36).substring(2, 8);
  let filename = `${fieldName}_${timestamp}_${random}.${extension}`;

  const folderPath = path.join(UPLOAD_DIR, folder);

  if (!existsSync(folderPath)) {
    await mkdir(folderPath, { recursive: true });
  }

  let filepath = path.join(folderPath, filename);
  await writeFile(filepath, Buffer.from(data, 'base64'));

  return `/uploads/${folder}/${filename}`;
}

export async function saveFormFile(
  file: File,
  folder: string = 'general',
): Promise<string> {
  let bytes = await file.arrayBuffer();
  let buffer = Buffer.from(bytes);

  let timestamp = Date.now();
  let random = Math.random().toString(36).substring(2, 8);
  let extension = file.name.split('.').pop() || 'bin';
  let filename = `${timestamp}_${random}.${extension}`;

  const folderPath = path.join(UPLOAD_DIR, folder);
  if (!existsSync(folderPath)) {
    await mkdir(folderPath, { recursive: true });
  }

  let filepath = path.join(folderPath, filename);
  await writeFile(filepath, buffer);

  return `/uploads/${folder}/${filename}`;
}

export async function fileExists(publicPath: string): Promise<boolean> {
  try {
    const filepath = path.join(process.cwd(), 'public', publicPath);
    await stat(filepath);
    return true;
  } catch {
    return false;
  }
}

export async function getFileSize(publicPath: string): Promise<number> {
  let filepath = path.join(process.cwd(), 'public', publicPath);
  let stats = await stat(filepath);
  return stats.size;
}

export function getFileUrl(publicPath: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}${publicPath}`;
}

export function validateFileType(
  mimeType: string,
  allowedType: string[],
): boolean {
  return allowedType.some((type) => {
    if (type.endsWith('/*')) {
      return mimeType.startsWith(type.replace('/*', ''));
    }
    return mimeType === type;
  });
}

export function validateFileSize(size: number, maxSize: number): boolean {
  return size <= maxSize;
}
