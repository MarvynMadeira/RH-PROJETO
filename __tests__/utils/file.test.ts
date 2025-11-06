import {
  saveDoc,
  saveFormFile,
  fileExists,
  getFileSize,
  getFileUrl,
  validateFileType,
  validateFileSize,
} from '@/lib/utils/file.utils';

describe('File Utils', () => {
  const testBase64 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  afterEach(async () => {
    // Limpar arquivos de teste
  });

  describe('saveBase64File', () => {
    it('deve salvar arquivo base64', async () => {
      const filepath = await saveDoc(testBase64, 'test', 'temp');
      expect(filepath).toMatch(/^\/uploads\/temp\/test_\d+_[a-z0-9]+\.png$/);
    });

    it('deve criar pasta se não existir', async () => {
      const filepath = await saveDoc(testBase64, 'test', 'newfolder');
      expect(filepath).toContain('/newfolder/');
    });

    it('deve rejeitar base64 inválido', async () => {
      await expect(saveDoc('invalid', 'test')).rejects.toThrow(
        'Dados base64 inválidos',
      );
    });

    it('deve gerar nomes únicos', async () => {
      const file1 = await saveDoc(testBase64, 'test', 'temp');
      const file2 = await saveDoc(testBase64, 'test', 'temp');
      expect(file1).not.toBe(file2);
    });
  });

  describe('getFileUrl', () => {
    it('deve gerar URL completa', () => {
      const url = getFileUrl('/uploads/test/file.jpg');
      expect(url).toBe(
        `${process.env.NEXT_PUBLIC_APP_URL}/uploads/test/file.jpg`,
      );
    });
  });

  describe('validateFileType', () => {
    it('deve validar tipo exato', () => {
      expect(validateFileType('image/png', ['image/png', 'image/jpeg'])).toBe(
        true,
      );
    });

    it('deve validar wildcard', () => {
      expect(validateFileType('image/png', ['image/*'])).toBe(true);
      expect(validateFileType('application/pdf', ['image/*'])).toBe(false);
    });

    it('deve rejeitar tipo não permitido', () => {
      expect(validateFileType('video/mp4', ['image/png'])).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('deve aceitar arquivo dentro do limite', () => {
      expect(validateFileSize(1000, 5000)).toBe(true);
    });

    it('deve rejeitar arquivo acima do limite', () => {
      expect(validateFileSize(6000, 5000)).toBe(false);
    });

    it('deve aceitar arquivo no limite exato', () => {
      expect(validateFileSize(5000, 5000)).toBe(true);
    });
  });
});
