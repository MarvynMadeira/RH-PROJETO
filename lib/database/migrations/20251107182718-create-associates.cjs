'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('associates', {
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
      form_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'forms',
          key: 'id',
        },
        onDelete: 'RESTRICT',
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      form_data: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
      inactive_reason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      inactive_file: {
        type: Sequelize.STRING,
        allowNull: true,
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

    await queryInterface.addIndex('associates', ['admin_id']);
    await queryInterface.addIndex('associates', ['form_id']);
    await queryInterface.addIndex('associates', ['status']);
    await queryInterface.addIndex('associates', ['username']);

    await queryInterface.sequelize.query(
      'CREATE INDEX associates_form_data_gin ON associates USING gin (form_data);',
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('associates');
  },
};
