'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Products 모델과 N:1
      this.belongsTo(models.Products, {
        targetKey: 'productId',
        foreignKey: 'ProductId',
      });
      // Orders 모델과 N:1
      this.belongsTo(models.Orders, {
        targetKey: 'orderId',
        foreignKey: 'OrderId',
      });
    }
  }
  OrderItems.init(
    {
      orderItemId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      OrderId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Orders',
          key: 'orderId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      ProductId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Products',
          key: 'productId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      options: {
        allowNull: false,
        type: DataTypes.JSON,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'OrderItems',
    }
  );
  return OrderItems;
};
