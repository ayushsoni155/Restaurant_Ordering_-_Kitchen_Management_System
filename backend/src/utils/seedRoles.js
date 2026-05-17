const Role = require('../models/Role');
const logger = require('../utils/logger');
const seedDefaultRoles = async () => {
  try {
    const roles = [
      { name: 'admin' },
      { name: 'chef' },
      { name: 'waiter' },
    ];

    await Role.bulkCreate(roles, { ignoreDuplicates: true });
    logger.info('Default roles verified/seeded successfully.');
  } catch (error) {
    logger.error('Failed to seed default roles:', error);
  }
};

module.exports = seedDefaultRoles;