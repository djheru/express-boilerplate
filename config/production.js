//Production
module.exports = {

    "logger": {
        "filename":"logs/run.json",
        "errorFilename": "logs/error.json",
        "expressFilename": "logs/express.log",
        "level": "silly",
        "format": ":date :remote-addr :method :url :status"
    },

    "saltWorkFactor": 10,

    "tokenExpiration": 12000000
};