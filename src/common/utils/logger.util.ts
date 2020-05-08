import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const dirname = './logs';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.splat(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(infor => `${infor.timestamp} [${infor.label}] ${infor.level}: ${infor.message}`)
  ),

  transports: [
    new winston.transports.Console({
      level: 'info'
    }),
    new DailyRotateFile({
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      dirname
    })
  ],

  exceptionHandlers: [
    new winston.transports.Console({
      level: 'info'
    }),
    new DailyRotateFile({
      filename: 'exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      dirname
    })
  ],

  exitOnError: false
});

export default logger;
