const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItemCustomization = sequelize.define(
  'OrderItemCustomization',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    option_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'order_item_customizations',
    timestamps: false,
  }
);

module.exports = OrderItemCustomization;
