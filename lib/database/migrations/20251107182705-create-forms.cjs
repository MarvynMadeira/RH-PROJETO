'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('forms', {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      survey_json: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('forms', ['admin_id']);
    await queryInterface.addIndex('forms', ['is_active']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('forms');
  },
};
