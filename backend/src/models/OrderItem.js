const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItem = sequelize.define(
  'OrderItem',
  {
    order_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price_at_order_time: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Snapshot of price at time of ordering to avoid price change issues',
    },
  },
  {
    tableName: 'order_items',
    timestamps: false,
  }
);

module.exports = OrderItem;
