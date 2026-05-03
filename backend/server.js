require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { sequelize } = require('./src/models');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

async function startServer() {
    try {
        // Test DB connection
        await sequelize.authenticate();
        logger.info('Database connection established.');

        // Sync all models (use { force: true } ONLY in dev to drop & recreate tables)
        await sequelize.sync({ alter: true });
        logger.info('All models synced to the database.');

        server.listen(PORT, () => {
            logger.info(`🚀  Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        logger.error('Unable to start server', { error });
        process.exit(1);
    }
}

startServer();
