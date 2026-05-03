const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define(
  'Payment',
  {
    payment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM('cash', 'razorpay'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'success', 'failed'),
      defaultValue: 'pending',
    },
    transaction_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Razorpay transaction ID (null for cash payments)',
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'payments',
    timestamps: false,
  }
);

module.exports = Payment;
