import { Model, DataTypes, Sequelize } from 'sequelize';

export class Associate extends Model {
  public id!: string;
  public adminId!: string;
  public formId!: string;
  public username!: string;
  public password!: string;
  public formData!: object;
  public status!: 'active' | 'inactive';
  public inactiveReason?: string;
  public inactiveFile?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initAssociate(sequelize: Sequelize) {
  Associate.init(
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
        onDelete: 'RESTRICT',
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      formData: {
        type: DataTypes.JSONB,
        allowNull: false,
        field: 'form_data',
        defaultValue: {},
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
      inactiveReason: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'inactive_reason',
      },
      inactiveFile: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'inactive_file',
      },
    },
    {
      sequelize,
      tableName: 'associates',
      underscored: true,
      indexes: [
        { fields: ['admin_id'] },
        { fields: ['status'] },
        { fields: ['form_id'] },
        { using: 'gin', fields: ['form_data'] },
      ],
    },
  );
  return Associate;
}
