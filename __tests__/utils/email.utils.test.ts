import {
  sendVerificationEmail,
  sendAssociateCredentials,
  sendFormLink,
  sendFieldLink,
} from '@/lib/utils/email.util';

jest.mock('nodemailer');

import * as nodemailer from 'nodemailer';

describe('Email Utils', () => {
  const mockSendMail = jest.fn().mockResolvedValue({ messageId: '123' });

  beforeEach(() => {
    jest.clearAllMocks();

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: mockSendMail,
    });
  });

  describe('sendVerificationEmail', () => {
    it('deve enviar email de verificação', async () => {
      await sendVerificationEmail('test@example.com', 'token123');

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: expect.stringContaining('Verifique seu email'),
        }),
      );
    });

    it('deve incluir link com token', async () => {
      await sendVerificationEmail('test@example.com', 'token123');

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('token123');
      expect(callArgs.html).toContain('/verify-email?token=');
    });
  });

  describe('sendAssociateCredentials', () => {
    it('deve enviar credenciais', async () => {
      await sendAssociateCredentials('user@example.com', 'user123', 'pass123');

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('user123');
      expect(callArgs.html).toContain('pass123');
    });
  });

  describe('sendFormLink', () => {
    it('deve enviar link do formulário', async () => {
      await sendFormLink(
        'user@example.com',
        'http://link.com',
        'Formulário Teste',
        'Admin',
      );

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('Formulário Teste');
      expect(callArgs.html).toContain('http://link.com');
    });
  });

  describe('sendFieldLink', () => {
    it('deve enviar link de campo customizado', async () => {
      await sendFieldLink(
        'user@example.com',
        'http://link.com',
        'Conta Bancária',
        'Admin',
      );

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('Conta Bancária');
    });
  });
});
