import { Model, DataTypes, Sequelize } from 'sequelize';
import { validateCPF } from '@/lib/validators/cpf.validator';
import { validateCNPJ } from '../validators/cnpj.validator';
import { normalizeGmail } from '@/lib/utils/email-parser.util';

export class Admin extends Model {
  public id!: string;
  public email!: string;
  public password!: string;
  public cpfCnpj!: string;
  public name!: string;
  public uniqueToken!: string;
  public emailVerified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initAdmin(sequelize: Sequelize) {
  Admin.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        set(value: string) {
          this.setDataValue('email', normalizeGmail(value));
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cpfCnpj: {
        type: DataTypes.STRING(14),
        allowNull: false,
        unique: true,
        field: 'cpf_cnpj',
        validate: {
          isValidDocument(value: string) {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length === 11 && !validateCPF(value)) {
              throw new Error('CPF inválido');
            }
            if (cleaned.length === 14 && !validateCNPJ(value)) {
              throw new Error('CNPJ inválido');
            }
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uniqueToken: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'unique_token',
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'email_verified',
      },
    },
    {
      sequelize,
      tableName: 'admins',
      underscored: true,
      hooks: {
        beforeValidate: (admin: Admin) => {
          if (admin.email) {
            admin.email = normalizeGmail(admin.email);
          }
        },
      },
    },
  );
  return Admin;
}
