const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Role = sequelize.define(
  'Role',
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.ENUM('admin', 'chef', 'waiter'),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'roles',
    timestamps: false,
  }
);

module.exports = Role;
