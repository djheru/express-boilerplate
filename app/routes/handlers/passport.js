//Handler for passport routes
module.exports = function (express, passport, config) {
    return {

        //Middleware to glean the provider type
        "params": {
            "provider": function (req, res, next, provider) {
                req.provider = (config.passport.authProviders.indexOf(provider) < 0) ? 'local' : provider;
                next();
            }
        },

        //Logging in so to speak
        "authentication": {
            "get": function (req, res, next) {
                passport.authenticate(req.provider, {scope: 'email'})(req, res, next);
            }
        },

        //Authorizing for access to resources
        "authorization": {
            "get": function (req, res, next) {
                passport.authorize(req.provider, {scope: 'email'})(req, res, next)
            }
        },

        //Go here after auth or auth
        "callback": {
            "get": function (req, res, next) {
                passport.authenticate(req.provider, config.passport.redirect)(req, res, next);
            }
        },

        //Remove personal data from profvider credentials, keeping ability to log in
        "unlinking": {
            "all": function (req, res, next) {
                if (req.provider == 'local') {//Do nothing for local
                    res.redirect(config.passport.redirect.successRedirect);
                }
                next();
            },
            "get": function (req, res) {
                if (!req.user) {
                    res.redirect(config.passport.redirect.failureRedirect)
                }
                var user = req.user;
                user[req.provider]['token'] = undefined;
                user.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    res.redirect(config.passport.redirect.successRedirect);
                });
            }
        }

    }
}