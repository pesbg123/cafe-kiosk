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
      // OrderItems 모델과 1:N
      this.hasMany(models.OrderItems, {
        sourceKey: 'optionId',
        foreignKey: 'OptionId',
      });
      // OrderOptions 모델과 1:N
      this.hasMany(models.OrderOptions, {
        sourceKey: 'optionId',
        foreignKey: 'OptionId',
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
        references: {
          model: 'Products',
          key: 'productId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        type: DataTypes.INTEGER,
      },
      extra_price: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },
      hot: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      shot_price: {
        allowNull: false,
        defaultValue: 0,
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
      modelName: 'Options',
    }
  );
  return Options;
};
