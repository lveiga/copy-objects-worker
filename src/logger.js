/* eslint-disable no-dupe-class-members */

const winston = require('winston');
const path = require('path');

const timestampFormat = () => new Date(Date.now()).toUTCString();

const getLabel = ((callingModule) => {
  const parts = callingModule.filename.split(path.sep);
  return `${parts[parts.length - 2]}/${parts.pop()}`;
});

class LoggerService {
  constructor(route) {
    this.log_data = null;
    this.route = route;
    const logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          level: 'info',
          filename: './logs/info.log',
        }),
        new winston.transports.File({
          level: 'error',
          filename: './logs/error.log',
        }),
      ],
      format: winston.format.printf((info) => {
        let message = `${info.level.toUpperCase()} | ${timestampFormat()} | ${getLabel(this.route)} | ${info.message} | `;
        message = info.obj ? `${message}data:${JSON.stringify(info.obj)} | ` : message;
        message = this.log_data ? `${message}log_data:${JSON.stringify(this.log_data)} | ` : message;
        return message;
      }),
    });
    this.logger = logger;
  }

  setLogData(logData) {
    this.log_data = logData;
  }

  async info(message) {
    this.logger.log('info', message);
  }

  async info(message, obj) {
    this.logger.log('info', message, {
      obj,
    });
  }

  async debug(message) {
    this.logger.log('debug', message);
  }

  async debug(message, obj) {
    this.logger.log('debug', message, {
      obj,
    });
  }

  async error(message) {
    this.logger.log('error', message);
  }

  async error(message, obj) {
    this.logger.log('error', message, {
      obj,
    });
  }
}
module.exports = LoggerService;
