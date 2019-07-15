const nconf = require('nconf')
const winston = require('winston')
const { createLogger, format, transports } = winston

function formatParams(info) {
    const { timestamp, level, message, ...args } = info;
    const ts = timestamp.slice(0, 19).replace("T", " ");
    return `${ts} ${level}: ${message} ${Object.keys(args).length
      ? JSON.stringify(args, () => "", "")
      : ""}`;
  }

const developmentFormat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(formatParams)
)

const productionFormat = format.combine(
    format.timestamp(),
    format.align(),
    format.printf(formatParams)
)

let logger
if (nconf.get('NODE_ENV') !== 'production') {
    logger = createLogger({
        level: nconf.get('LOG_LEVEL'),
        format: developmentFormat,
        transports: [new transports.Console()]
    })
} else {
    logger = createLogger({
        level: nconf.get('LOG_LEVEL'),
        format: productionFormat,
        transports: [
          new transports.Console(),
          new transports.File({ filename: "tusc.log" })
        ]
    })
}

module.exports = logger
