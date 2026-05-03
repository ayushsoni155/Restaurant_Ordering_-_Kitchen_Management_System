const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RestaurantTable = sequelize.define(
  'RestaurantTable',
  {
    table_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    table_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied'),
      defaultValue: 'available',
    },
  },
  {
    tableName: 'restaurant_tables',
    timestamps: false,
  }
);

module.exports = RestaurantTable;
