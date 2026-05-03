const { createLogger, format, transports } = require('winston');
const {
  colorize,
  align,
  printf,
  timestamp,
  errors,
  splat,
  combine,
} = format;
const { consoleFormat } = require('winston-console-format');

const logger = createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warn' : 'debug'),
  format: combine(
    errors({ stack: true }),   // capture error stacks
    splat(),                   // support printf-style %s %d etc.
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        align(),
        consoleFormat({
          showMeta: true,
          metaStrip: ['timestamp', 'service'],
          inspectOptions: {
            depth: Infinity,
            colors: true,
            maxArrayLength: Infinity,
            breakLength: 120,
            compact: Infinity,
          },
        }),
      ),
    }),
  ],
});

module.exports = logger;
