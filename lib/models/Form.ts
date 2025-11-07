import { Model, DataTypes, Sequelize } from 'sequelize';

export class Form extends Model {
  public id!: string;
  public adminId!: string;
  public name!: string;
  public description!: string;
  public surveyJson!: object;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initForm(sequelize: Sequelize) {
  Form.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      surveyJson: {
        type: DataTypes.JSONB,
        defaultValue: {
          title: 'Registros dos associados',
          pages: [
            {
              elements: [],
            },
          ],
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      sequelize,
      tableName: 'forms',
      underscored: true,
      indexes: [{ fields: ['admin_id'] }, { fields: ['is_active'] }],
    },
  );
  return Form;
}
