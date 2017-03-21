import winston = require('winston');
import fs = require('fs');
import { LoggerInstance } from 'winston';

export class LoggerFactory {
    private static logger: LoggerInstance;

    private static customLevels = {
        levels: {
            trace: 5,
            debug: 4,
            info: 3,
            warn: 2,
            crit: 1,
            error: 0 
        },
        colors: {
            trace: 'white',
            debug: 'cyan',
            info: 'green',
            warn: 'yellow',
            crit: 'red',
            error: 'red' 
        }
    };

    private constructor() {}

    static getLogger(): LoggerInstance {
        if (!fs.existsSync('./logs')) {
            fs.mkdir('./logs');
        }

        const loggerOptions: any = {
            write: message => {
                LoggerFactory.logger.info(message);
            }
        };

        if (!LoggerFactory.logger) {
            const logLevel = process.env.LOG_LEVEL;
            LoggerFactory.logger = new winston.Logger({
                levels: LoggerFactory.customLevels.levels,
                colors: LoggerFactory.customLevels.colors,
                transports: [
                    new (winston.transports.Console)({
                        level: logLevel,
                        json: false,
                        handleExceptions: true,
                        humanReadableException: true,
                        timestamp: true,
                        colorize: true
                    }),
                    new (winston.transports.File) ({
                        filename: 'logs/aurora.log',
                        json: true,
                        maxSize: 1000,
                        maxFiles: 5,
                        level: logLevel
                    })
                ]
            });
        }



        LoggerFactory.logger.stream = loggerOptions;
        //winston.addColors(LoggerFactory.customColors);
        return LoggerFactory.logger;
    }
}

export { LoggerInstance as Logger };