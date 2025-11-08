import { Model, DataTypes, Sequelize } from 'sequelize';

export class FieldLink extends Model {
  public id!: string;
  public adminId!: string;
  public customFieldId!: string;
  public associateId!: string;
  public token!: string;
  public expiresAt!: Date;
  public isActive!: boolean;
  public completed!: boolean;
  public completedAt?: Date;
  public readonly createdAt!: Date;
}

export function initFieldLink(sequelize: Sequelize) {
  FieldLink.init(
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
      customFieldId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'custom_field_id',
        references: {
          model: 'custom_fields',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      associateId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'associate_id',
        references: {
          model: 'associates',
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
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'completed_at',
      },
    },
    {
      sequelize,
      tableName: 'field_links',
      underscored: true,
      updatedAt: false,
      indexes: [
        { fields: ['token'] },
        { fields: ['associate_id'] },
        { fields: ['completed'] },
      ],
    },
  );

  return FieldLink;
}
