const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderStatusLog = sequelize.define(
  'OrderStatusLog',
  {
    log_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      allowNull: false,
    },
    changed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'FK to users.user_id',
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'order_status_logs',
    timestamps: false,
  }
);

module.exports = OrderStatusLog;
