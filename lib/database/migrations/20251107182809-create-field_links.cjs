'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('field_links', {
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
      custom_field_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'custom_fields',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      associate_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'associates',
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
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('field_links', ['token']);
    await queryInterface.addIndex('field_links', ['associate_id']);
    await queryInterface.addIndex('field_links', ['custom_field_id']);
    await queryInterface.addIndex('field_links', ['completed']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('field_links');
  },
};
