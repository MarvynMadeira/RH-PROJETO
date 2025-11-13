'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('official_forms', {
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
      associate_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true, // 1:1
        references: {
          model: 'associates',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      official_form_data: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      submission_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_submitted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
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

    await queryInterface.addIndex('official_forms', ['admin_id']);
    await queryInterface.addIndex('official_forms', ['associate_id'], {
      unique: true,
    });
    await queryInterface.addIndex('official_forms', ['is_submitted']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('official_forms');
  },
};
