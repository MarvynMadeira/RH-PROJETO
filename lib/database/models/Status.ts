import { Model, DataTypes, Sequelize } from 'sequelize';
import { StatusData } from '@/lib/schemas/status.schema';

export class Status extends Model {
  public id!: string;
  public adminId!: string;
  public associateId!: string;
  public data!: StatusData;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initStatus(sequelize: Sequelize) {
  Status.init(
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
      associateId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        field: 'associate_id',
        references: {
          model: 'associates',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'status',
      underscored: true,
      indexes: [
        { fields: ['admin_id'] },
        { fields: ['associate_id'], unique: true },
      ],
    },
  );
  return Status;
}
