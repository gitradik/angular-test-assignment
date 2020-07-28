'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('Rows', {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        number: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        amount: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        dueDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        sellPrice: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        invoiceId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Invoices',
            key: 'id'
          },
          referencesKey: 'id',
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        }
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Rows');
  }
};
