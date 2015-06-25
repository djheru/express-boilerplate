//=========================================================
// Passport Routes
//=========================================================

var config = appGlobals.config.get('app').routes;
var models = require('../models')();

module.exports = function (express, passport) {

    var handlers = require('./handlers/passport')(express, passport, config);

    //set us up the router
    var routeExport = express.Router();

    //validate provider param
    routeExport.param('provider', handlers.params.provider);

    //authentication route
    routeExport.route(config.passport.authentication)
        .get(handlers.authentication.get);

    //authorization route
    routeExport.route(config.passport.authorization)
        .get(handlers.authorization.get);

    //callback after authentication/authorization
    routeExport.route(config.passport.callback)
        .get(handlers.callback.get);

    //unlinking a provider
    routeExport.route(config.passport.unlinking)
        .all(handlers.unlinking.all)
        .get(handlers.unlinking.get);

    return routeExport;
}