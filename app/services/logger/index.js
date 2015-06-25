//logging
var winston = require('winston')
    , infoTransports = (appGlobals.config.get('logger').level == 'silly') ?
        [
            new (winston.transports.Console)({
                json: true,
                timestamp: true
            }),
            new winston.transports.File({
                filename: appGlobals.config.get('logger').filename,
                json: true
            })
        ] :
        [
            new winston.transports.File({
                filename: appGlobals.config.get('logger').filename,
                json: true
            })
        ]
    , errorTransports = [
        new (winston.transports.Console)({
            json: true,
            timestamp: true
        }),
        new winston.transports.File({
            filename: appGlobals.config.get('logger').errorFilename,
            json: true
        })
    ];

var logger = new (winston.Logger)({
    transports: infoTransports,
    exceptionHandlers: errorTransports,
    exitOnError: false
});

module.exports = logger;