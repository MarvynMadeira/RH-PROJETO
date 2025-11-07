'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('custom_fields', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      admin_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'admins',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      field_key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      field_label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      field_type: {
        type: Sequelize.ENUM(
          'text',
          'number',
          'date',
          'file',
          'dropdown',
          'multiselect',
        ),
        allowNull: false,
      },
      options: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      is_required: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      validation: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('custom_fields', ['admin_id']);
    await queryInterface.addIndex('custom_fields', ['field_key']);
    await queryInterface.addIndex('custom_fields', ['admin_id', 'field_key'], {
      unique: true,
      name: 'custom_fields_admin_field_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('custom_fields');
  },
};
