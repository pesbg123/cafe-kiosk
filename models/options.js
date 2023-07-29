'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Options extends Model {
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
    }
  }
  Options.init(
    {
      optionId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      extra_price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      shot_price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      hot: {
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
      modelName: 'Options',
    }
  );
  return Options;
};
