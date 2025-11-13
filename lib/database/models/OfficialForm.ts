import { Model, DataTypes, Sequelize } from 'sequelize';

import { officialFormData } from '@/lib/schemas/official-form.schema';

export class OfficialForm extends Model {
  public id!: string;
  public adminId!: string;
  public associateId!: string;
  public officialFormData!: officialFormData;
  public submissionDate!: Date;
  public isSubmitted!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initOfficialForm(sequelize: Sequelize) {
  OfficialForm.init(
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
      officialFormData: {
        type: DataTypes.JSONB,
        allowNull: false,
        field: 'official_form_data',
        defaultValue: {},
      },
      submissionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'submission_date',
      },
      isSubmitted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        field: 'is_submitted',
      },
    },
    {
      sequelize,
      tableName: 'official_forms',
      underscored: true,
      indexes: [
        { fields: ['admin_id'] },
        { fields: ['associate_id'], unique: true },
      ],
    },
  );
  return OfficialForm;
}
