import { Model, DataTypes, Sequelize } from 'sequelize';

export class FormLink extends Model {
  public id!: string;
  public adminId!: string;
  public formId!: string;
  public token!: string;
  public expiresAt!: Date;
  public isActive!: boolean;
  public readonly createdAt!: Date;
}

export function initFormLink(sequelize: Sequelize) {
  FormLink.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      adminId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'admin_id',
        references: {
          model: 'admins',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      formId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'form_id',
        references: {
          model: 'forms',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      sequelize,
      tableName: 'form_links',
      underscored: true,
      updatedAt: false,
      indexes: [
        { fields: ['token'] },
        { fields: ['expires_at'] },
        { fields: ['is_active'] },
      ],
    },
  );

  return FormLink;
}
