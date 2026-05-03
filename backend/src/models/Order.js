const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define(
  'Order',
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    table_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customer_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    customer_phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'served',
        'cancelled'
      ),
      defaultValue: 'pending',
    },
    payment_method: {
      type: DataTypes.ENUM('cash', 'online'),
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'paid'),
      defaultValue: 'pending',
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
    },
    eta_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Order;
