/**
 * models/index.js
 * Central registry: imports all models, defines associations, exports them.
 * Import from here everywhere — never require individual model files directly.
 */

const sequelize = require('../config/db');

// ── Import all models ──────────────────────────────────────────────────────────
const Role                  = require('./Role');
const User                  = require('./User');
const RestaurantTable       = require('./RestaurantTable');
const Category              = require('./Category');
const MenuItem              = require('./MenuItem');
const ItemCustomization     = require('./ItemCustomization');
const CustomizationOption   = require('./CustomizationOption');
const Order                 = require('./Order');
const OrderItem             = require('./OrderItem');
const OrderItemCustomization= require('./OrderItemCustomization');
const OrderStatusLog        = require('./OrderStatusLog');
const WaiterAssignment      = require('./WaiterAssignment');
const Payment               = require('./Payment');
const Review                = require('./Review');

// ── Associations ───────────────────────────────────────────────────────────────

// Role <-> User
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

// Category <-> MenuItem
Category.hasMany(MenuItem, { foreignKey: 'category_id', as: 'menuItems' });
MenuItem.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// MenuItem <-> ItemCustomization
MenuItem.hasMany(ItemCustomization, { foreignKey: 'item_id', as: 'customizations' });
ItemCustomization.belongsTo(MenuItem, { foreignKey: 'item_id', as: 'menuItem' });

// ItemCustomization <-> CustomizationOption
ItemCustomization.hasMany(CustomizationOption, { foreignKey: 'customization_id', as: 'options' });
CustomizationOption.belongsTo(ItemCustomization, { foreignKey: 'customization_id', as: 'customization' });

// RestaurantTable <-> Order
RestaurantTable.hasMany(Order, { foreignKey: 'table_id', as: 'orders' });
Order.belongsTo(RestaurantTable, { foreignKey: 'table_id', as: 'table' });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'orderItems' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// MenuItem <-> OrderItem
MenuItem.hasMany(OrderItem, { foreignKey: 'item_id', as: 'orderItems' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'item_id', as: 'menuItem' });

// OrderItem <-> OrderItemCustomization
OrderItem.hasMany(OrderItemCustomization, { foreignKey: 'order_item_id', as: 'selectedCustomizations' });
OrderItemCustomization.belongsTo(OrderItem, { foreignKey: 'order_item_id', as: 'orderItem' });

// ItemCustomization <-> OrderItemCustomization
ItemCustomization.hasMany(OrderItemCustomization, { foreignKey: 'customization_id' });
OrderItemCustomization.belongsTo(ItemCustomization, { foreignKey: 'customization_id', as: 'customization' });

// CustomizationOption <-> OrderItemCustomization
CustomizationOption.hasMany(OrderItemCustomization, { foreignKey: 'option_id' });
OrderItemCustomization.belongsTo(CustomizationOption, { foreignKey: 'option_id', as: 'option' });

// Order <-> OrderStatusLog
Order.hasMany(OrderStatusLog, { foreignKey: 'order_id', as: 'statusLogs' });
OrderStatusLog.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// User (changed_by) <-> OrderStatusLog
User.hasMany(OrderStatusLog, { foreignKey: 'changed_by', as: 'statusChanges' });
OrderStatusLog.belongsTo(User, { foreignKey: 'changed_by', as: 'changedBy' });

// Order <-> WaiterAssignment (one-to-one)
Order.hasOne(WaiterAssignment, { foreignKey: 'order_id', as: 'waiterAssignment' });
WaiterAssignment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// User (waiter) <-> WaiterAssignment
User.hasMany(WaiterAssignment, { foreignKey: 'waiter_id', as: 'assignments' });
WaiterAssignment.belongsTo(User, { foreignKey: 'waiter_id', as: 'waiter' });

// Order <-> Payment (one-to-one)
Order.hasOne(Payment, { foreignKey: 'order_id', as: 'payment' });
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Order <-> Review (one-to-one)
Order.hasOne(Review, { foreignKey: 'order_id', as: 'review' });
Review.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// ── Export everything ──────────────────────────────────────────────────────────
module.exports = {
  sequelize,
  Role,
  User,
  RestaurantTable,
  Category,
  MenuItem,
  ItemCustomization,
  CustomizationOption,
  Order,
  OrderItem,
  OrderItemCustomization,
  OrderStatusLog,
  WaiterAssignment,
  Payment,
  Review,
};
