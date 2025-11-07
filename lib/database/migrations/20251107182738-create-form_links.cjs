'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('form_links', {
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
        onDelete: 'CASCADE',
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('form_links', ['token']);
    await queryInterface.addIndex('form_links', ['admin_id']);
    await queryInterface.addIndex('form_links', ['form_id']);
    await queryInterface.addIndex('form_links', ['expires_at']);
    await queryInterface.addIndex('form_links', ['is_active']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('form_links');
  },
};
