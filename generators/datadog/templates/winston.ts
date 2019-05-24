import {
  createLogger,
  format,
  transports,
  LoggerOptions
} from 'winston';
import * as config from 'config';

const getConfig = <T>(key: string, defaultValue: T): T =>
  config.has(key) ? config.get(key) : defaultValue;

const formats = {
  simple: () => format.simple(),
  default: () => format.json()
};

const getFormat = formats[getConfig('winston.format', 'default')];

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
