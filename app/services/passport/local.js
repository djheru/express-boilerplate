// Local Passport Config

var LocalStrategy = require('passport-local').Strategy;
var config = appGlobals.config.get('auth');
var utils = require('../../routes/middleware/utils');
module.exports = function(passport, models){

    var User = models.User;

    // ====================================================
    // Local Strategy Signup
    // ====================================================
    passport.use('local-signup', new LocalStrategy(config.localAuth, function (req, email, password, done) {

        process.nextTick(function () {
            if (!req.user) { // unauthenticated user
                User.findOne({ 'local.email': email }, function (err, user) {

                    if (err) {
                        return done(err);
                    }

                    if (user) {// Email already taken
                        var errMsgs = ['Sorry, that email has been used'];
                        var params = ['email'];
                        utils.customValidationUtility(req, params, errMsgs);
                        return done(null, false);
                    } else {
                        // The email is available
                        // create the new user
                        var newUser = new User();

                        // Set credentials
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        // Save the new user
                        newUser.save(function (err) {
                            if (err) {
                                return done(err);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            } else { //User authenticated via a different provider
                var user = req.user;
                // Add local auth to the user
                user.local.email = email;
                user.local.password = user.generateHash(password);

                // Save the new user
                user.save(function (err) {
                    if (err) {
                        return done(err);
                    }
                    return done(null, user);
                });
            }
        });
    }));

    // ====================================================
    // Local Strategy Login
    // ====================================================
    passport.use('local-login', new LocalStrategy(config.localAuth, function (req, email, password, done) {
        User.findOne({'local.email': email}, function (err, user) {

            if (err) {
                return done(err);
            }

            // user email not found
            if (!user) {
                var errMsgs = ['No user with that email exists'];
                var params = ['email'];
                utils.customValidationUtility(req, params, errMsgs);
                return done(null, false);
            }

            //wrong password
            if (!user.validPassword(password)){
                var errMsgs = ['Sorry, password not found'];
                var params = ['password'];
                utils.customValidationUtility(req, params, errMsgs);
                return done(null, false);
            }

            return done(null, user);
        });
    }));
}
