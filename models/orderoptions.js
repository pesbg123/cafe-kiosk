'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderOptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Orders 모델과 N:1
      this.belongsTo(models.Orders, {
        targetKey: 'orderId',
        foreignKey: 'OrderId',
      });
      // Options 모델과 N:1
      this.belongsTo(models.Options, {
        targetKey: 'optionId',
        foreignKey: 'OptionId',
      });
    }
  }
  OrderOptions.init(
    {
      orderOptionId: {
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
      OptionId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Options',
          key: 'optionId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      modelName: 'OrderOptions',
    }
  );
  return OrderOptions;
};
