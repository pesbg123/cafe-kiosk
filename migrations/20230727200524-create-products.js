'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      productId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productName: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      productPrice: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('coffee', 'juice', 'food'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  },
};
