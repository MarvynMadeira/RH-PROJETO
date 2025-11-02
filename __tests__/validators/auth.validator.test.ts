import {
  adminRegisterSchema,
  loginSchema,
} from '@/lib/validators/form.validator';

describe('Auth Validator', () => {
  describe('adminRegisterSchema', () => {
    const validData = {
      name: 'Marvyn Souza Madeira',
      email: 'marvyn@gmail.com',
      password: 'StrongP@ssw0rd!',
      cpfCnpj: '17507495728',
    };

    it('deve validar os dados corretos do registro', () => {
      expect(() => adminRegisterSchema.parse(validData)).not.toThrow();
    });

    describe('validação de nome', () => {
      it('deve rejeitar nome curto (menos de 3 letras)', () => {
        const data = { ...validData, name: 'Ma' };
        expect(() => adminRegisterSchema.parse(data)).toThrow(
          'Nome deve conter ao menos três letras',
        );
      });

      it('deve aceitar nome com 3 letras', () => {
        const data = { ...validData, name: 'Ana' };
        expect(() => adminRegisterSchema.parse(data)).not.toThrow();
      });

      it('deve aceitar nome com caracteres especiais', () => {
        const data = { ...validData, name: 'Ana-Maria Silva/Silva' };
        expect(() => adminRegisterSchema.parse(data)).not.toThrow();
      });

      it('deve aceitar nome com acentuação', () => {
        const data = { ...validData, name: 'José Álvaro' };
        expect(() => adminRegisterSchema.parse(data)).not.toThrow();
      });

      it('deve rejeitar nome vazio', () => {
        const data = { ...validData, name: '' };
        expect(() => adminRegisterSchema.parse(data)).toThrow(
          'Nome é obrigatório',
        );
      });
    });

    describe('validação de email', () => {
      it('deve aceitar email válido', () => {
        const emails = [
          'user@example.com',
          'user.name@example.com',
          'user+tag@example.co.uk',
          'user_123@subdomain.example.com',
        ];
        emails.forEach((email) => {
          const data = { ...validData, email };
          expect(() => adminRegisterSchema.parse(data)).not.toThrow();
        });
      });

      it('deve rejeitar email inválido', () => {
        const emails = [
          'userexample.com',
          'user@.com',
          'user@com',
          'user@domain..com',
        ];
        emails.forEach((email) => {
          const data = { ...validData, email };
          expect(() => adminRegisterSchema.parse(data)).toThrow(
            'Email inválido',
          );
        });
      });

      it('deve rejeitar email vazio', () => {
        const data = { ...validData, email: '' };
        expect(() => adminRegisterSchema.parse(data)).toThrow(
          'Email é obrigatório',
        );
      });
    });

    describe('validação de senha', () => {
      it('deve aceitar senha com 6 caracteres', () => {
        const data = { ...validData, password: '123456' };
        expect(() => adminRegisterSchema.parse(data)).not.toThrow();
      });

      it('deve rejeitar senha com menos de 6 caracteres', () => {
        const data = { ...validData, password: '12345' };
        expect(() => adminRegisterSchema.parse(data)).toThrow(
          'Senha deve conter ao menos seis caracteres',
        );
      });

      it('deve aceitar senha com caracteres especiais', () => {
        const data = { ...validData, password: 'P@ssw0rd!123' };
        expect(() => adminRegisterSchema.parse(data)).not.toThrow();
      });

      it('deve aceitar senha com espaços', () => {
        const data = { ...validData, password: 'My Password 123' };
        expect(() => adminRegisterSchema.parse(data)).not.toThrow();
      });

      it('deve rejeitar senha vazia', () => {
        const data = { ...validData, password: '' };
        expect(() => adminRegisterSchema.parse(data)).toThrow(
          'Senha é obrigatória',
        );
      });
    });

    describe('validação de CPF/CNPJ', () => {
      it('deve aceitar CPF válido (11 dígitos)', () => {
        const data = { ...validData, cpfCnpj: '17507495728' };
        expect(() => adminRegisterSchema.parse(data)).not.toThrow();
      });

      it('deve aceitar CNPJ válido (14 dígitos)', () => {
        const data = { ...validData, cpfCnpj: '12345678901234' };
        expect(() => adminRegisterSchema.parse(data)).not.toThrow();
      });

      it('deve aceitar CPF formatado', () => {
        const data = { ...validData, cpfCnpj: '175.074.957-28' };
        expect(() => adminRegisterSchema.parse(data)).not.toThrow();
      });

      it('deve aceitar CNPJ formatado', () => {
        const data = { ...validData, cpfCnpj: '12.345.678/9012-34' };
        expect(() => adminRegisterSchema.parse(data)).not.toThrow();
      });

      it('deve rejeitar CPF/CNPJ com tamanho inválido', () => {
        const data = { ...validData, cpfCnpj: '12345' };
        expect(() => adminRegisterSchema.parse(data)).toThrow(
          'CPF/CNPJ deve ter 11 ou 14 dígitos',
        );
      });

      it('deve rejeitar CPF/CNPJ vazio', () => {
        const data = { ...validData, cpfCnpj: '' };
        expect(() => adminRegisterSchema.parse(data)).toThrow(
          'CPF/CNPJ é obrigatório',
        );
      });
    });

    describe('validação de campos vazios', () => {
      it('deve rejeitar quando falta nome', () => {
        const { name, ...data } = validData;
        expect(() => adminRegisterSchema.parse(data)).toThrow(
          'Nome é obrigatório',
        );
      });

      it('deve rejeitar quando falta email', () => {
        const { email, ...data } = validData;
        expect(() => adminRegisterSchema.parse(data)).toThrow(
          'Email é obrigatório',
        );
      });

      it('deve rejeitar quando falta senha', () => {
        const { password, ...data } = validData;
        expect(() => adminRegisterSchema.parse(data)).toThrow(
          'Senha é obrigatória',
        );
      });

      it('deve rejeitar quando falta CPF/CNPJ', () => {
        const { cpfCnpj, ...data } = validData;
        expect(() => adminRegisterSchema.parse(data)).toThrow(
          'CPF/CNPJ é obrigatório',
        );
      });
    });
  });

  describe('loginSchema', () => {
    const validData = {
      email: 'marvyn@gmail.com',
      password: 'StrongP@ssw0rd!',
    };

    it('deve validar os dados corretos do login', () => {
      expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    describe('validação de email', () => {
      it('deve aceitar email válido', () => {
        expect(() => loginSchema.parse(validData)).not.toThrow();
      });

      it('deve rejeitar email inválido', () => {
        const data = { ...validData, email: 'userexample.com' };
        expect(() => loginSchema.parse(data)).toThrow('Email inválido');
      });

      it('deve rejeitar email vazio', () => {
        const data = { ...validData, email: '' };
        expect(() => loginSchema.parse(data)).toThrow('Email é obrigatório');
      });
    });

    describe('validação de senha', () => {
      it('deve aceitar qualquer senha não vazia', () => {
        const passwords = ['123456', 'short', 'p@ssw0rd!', '   '];
        passwords.forEach((password) => {
          const data = { ...validData, password };
          expect(() => loginSchema.parse(data)).not.toThrow();
        });
      });

      it('deve rejeitar senha vazia', () => {
        const data = { ...validData, password: '' };
        expect(() => loginSchema.parse(data)).toThrow('Senha é obrigatória');
      });
    });

    describe('validação de campos ausentes', () => {
      it('deve rejeitar quando falta email no login', () => {
        const { email, ...data } = validData;
        expect(() => loginSchema.parse(data)).toThrow('Email é obrigatório');
      });

      it('deve rejeitar quando falta senha no login', () => {
        const { password, ...data } = validData;
        expect(() => loginSchema.parse(data)).toThrow('Senha é obrigatória');
      });
    });

    describe('edge cases', () => {
      it('deve aceitar email com case diferente', () => {
        const data = { ...validData, email: 'JoHn@ExAmPlE.CoM' };
        expect(() => loginSchema.parse(data)).not.toThrow();
      });

      it('deve aceitar senha com espaços em branco', () => {
        const data = { ...validData, password: '   StrongP@ssw0rd!   ' };
        expect(() => loginSchema.parse(data)).not.toThrow();
      });
    });
  });

  describe('Comparação entre schemas', () => {
    it('LoginSchema deve ser menos restritivo que o adminRegisterSchema', () => {
      const loginData = {
        email: 'test@example.com',
        password: '1',
      };
      expect(() => loginSchema.parse(loginData)).not.toThrow();

      const registerData = {
        name: 'Test',
        email: 'test@example.com',
        password: '1',
        cpfCnpj: '12345678901',
      };
      expect(() => adminRegisterSchema.parse(registerData)).toThrow();
    });
  });
});
