const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ItemCustomization = sequelize.define(
  'ItemCustomization',
  {
    customization_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'e.g. spicy level, oil level',
    },
    type: {
      type: DataTypes.ENUM('dropdown', 'text'),
      allowNull: false,
    },
  },
  {
    tableName: 'item_customizations',
    timestamps: false,
  }
);

module.exports = ItemCustomization;
