const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WaiterAssignment = sequelize.define(
  'WaiterAssignment',
  {
    assignment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    waiter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'FK to users.user_id where role is waiter',
    },
    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    acknowledged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    served_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'waiter_assignments',
    timestamps: false,
  }
);

module.exports = WaiterAssignment;
