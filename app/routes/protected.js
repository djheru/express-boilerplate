//=========================================================
// Protected (profile) Routes
//=========================================================

var config = appGlobals.config.get('app').routes
    , middleware = require('./middleware/index');

module.exports = function (express, passport) {

    var handlers = require('./handlers/protected')(express, passport, config);

    //set us up the router
    var routeExport = express.Router();

    //use middleware to ensure authenticated
    routeExport.use(middleware.isLoggedIn);

    //profile page
    routeExport.route(config.protected.profile)
        .get(handlers.profile.get);

    //link local account to existing provider login
    routeExport.route(config.protected.link)
        .get(handlers.link.get);

    return routeExport;
};
