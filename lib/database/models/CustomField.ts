import { Model, DataTypes, Sequelize } from 'sequelize';

export class CustomField extends Model {
  public id!: string;
  public adminId!: string;
  public fieldKey!: string;
  public fieldLabel!: string;
  public description!: string;
  public fieldType!:
    | 'text'
    | 'number'
    | 'date'
    | 'file'
    | 'dropdown'
    | 'multiselect';
  public options?: string[];
  public isRequired!: boolean;
  public validation?: object;
  public readonly createdAt!: Date;
}

export function initCustomField(sequelize: Sequelize) {
  CustomField.init(
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
      fieldKey: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'field_key',
      },
      fieldLabel: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'field_label',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fieldType: {
        type: DataTypes.ENUM(
          'text',
          'number',
          'date',
          'file',
          'dropdown',
          'multiselect',
        ),
        allowNull: false,
        field: 'field_type',
      },
      options: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      isRequired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_required',
      },
      validation: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'custom_fields',
      underscored: true,
      updatedAt: false,
      indexes: [
        { fields: ['admin_id'] },
        { fields: ['field_key'] },
        { unique: true, fields: ['admin_id', 'field_key'] },
      ],
    },
  );

  return CustomField;
}
