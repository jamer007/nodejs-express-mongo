'use strict';

const winston = require('winston');
const colors = require('colors/safe');

const colorCodes = {
  debug: 'gray',
  verbose: 'white',
  info: 'cyan',
  warn: 'yellow',
  error: 'red',
};

const consoleFormatter = winston.format.printf((info) => {
  const color = colorCodes[info.level] || 'white';
  return colors[color](`${info.level}: ${info.message}`);
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: consoleFormatter,
      humanReadableUnhandledException: true,
      handleExceptions: true,
      prettyPrint: true,
      colorize: true,
    }),
  ],
});

module.exports = logger;
