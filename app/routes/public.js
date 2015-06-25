//=========================================================
// Public Routes
//=========================================================

var config = appGlobals.config.get('app').routes;
var models = require('../models')();
var mailer = require('../services/mailer')();

module.exports = function (express, passport) {

    var handlers = require('./handlers/public')(express, passport, models, mailer, config);

    //set us up the router
    var routeExport = express.Router();

    //validate token param
    routeExport.param('resetToken', handlers.params.resetToken);

    //home routes
    routeExport.route(config.public.home)
        .get(handlers.home.get);

    //signup routes
    routeExport.route(config.public.signup)
        .get(handlers.signup.get)
        .post(handlers.signup.post);

    //login routes
    routeExport.route(config.public.login)
        .get(handlers.login.get)
        .post(handlers.login.post);

    //logout route
    routeExport.route(config.public.logout)
        .all(handlers.logout.all);

    //forgot password link
    routeExport.route(config.public.forgot)
        .get(handlers.forgot.get)
        .post(handlers.forgot.post);

    //reset password link
    routeExport.route(config.public.reset)
        .get(handlers.reset.get)
        .post(handlers.reset.post);

    return routeExport;
};
