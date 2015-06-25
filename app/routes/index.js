// routeExport Indexz
module.exports = function (express, passport) {

    var routeExport = {};

    routeExport.passport    = require('./passport')(express, passport);
    routeExport.protected   = require('./protected')(express, passport);
    routeExport.public      = require('./public')(express, passport);

    return routeExport;
};
