'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Users 모델과 N:1
      this.belongsTo(models.Users, {
        targetKey: 'userId',
        foreignKey: 'UserId',
      });
      // Guests 모델과 N:1
      this.belongsTo(models.Guests, {
        targetKey: 'guestId',
        foreignKey: 'GuestId',
      });
      // OrderItems 모델과 1:N
      this.hasMany(models.OrderItems, {
        sourceKey: 'orderId',
        foreignKey: 'OrderId',
      });
    }
  }
  Orders.init(
    {
      orderId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'userId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      GuestId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Guests',
          key: 'guestId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      orderState: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      modelName: 'Orders',
    }
  );
  return Orders;
};
