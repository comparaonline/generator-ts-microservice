import {
  createLogger,
  format,
  transports,
  LoggerOptions
} from 'winston';
import * as config from 'config';

const getFormat = () => {
  switch(config.get('winston.format')) {
    case 'simple':
      return format.simple();
    default:
      return format.json();
  }
};

export const loggerConfig: LoggerOptions = {
  format: getFormat(),
  transports: [
    new transports.Console()
  ],
  exceptionHandlers: [
    new transports.Console()
  ]
};

export const logger = createLogger(loggerConfig);
