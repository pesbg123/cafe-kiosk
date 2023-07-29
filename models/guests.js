'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Guests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Orders 모델과 1:N
      this.hasMany(models.Orders, {
        sourceKey: 'guestId',
        foreignKey: 'GuestId',
      });
    }
  }
  Guests.init(
    {
      guestId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      modelName: 'Guests',
    }
  );
  return Guests;
};
