'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('status', {
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
      data: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
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

    await queryInterface.addIndex('status', ['admin_id']);
    await queryInterface.addIndex('status', ['associate_id'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('status');
  },
};
