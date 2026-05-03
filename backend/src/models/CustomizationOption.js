const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CustomizationOption = sequelize.define(
  'CustomizationOption',
  {
    option_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'e.g. low, medium, high, extra spicy, no onion',
    },
    price_modifier: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      comment: 'Additional price for this option (can be 0)',
    },
  },
  {
    tableName: 'customization_options',
    timestamps: false,
  }
);

module.exports = CustomizationOption;
