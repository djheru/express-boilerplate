// Google passport config
var _ = require('underscore');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = appGlobals.config.get('auth');
var logger = appGlobals.logger;

module.exports = function(passport, models){

    var User = models.User;

    // ====================================================
    // Google Passport Strategy
    // ====================================================
    passport.use(new GoogleStrategy(config.googleAuth, function (req, token, refreshToken, profile, done) {

        //asynchronous
        process.nextTick(function () {

            //Does this google user exist?
            User.findOne({'google.id': profile.id}, function (err, user) {

                if (err) {// oops there goes my shirt
                    return done(err);
                }
                var sessionUser;
                if (user) {

                    //if user exists, check if they're logged in
                    if (req.user) {
                        sessionUser = req.user;

                        //user user is logged in and has google already
                        //are logged in user and fb user the same?
                        //if yes do nothing, otherwise merge and delete
                        if (!sessionUser.equals(user)) {
                            var mergedObj = sessionUser.generateMergedObject(user);
                            _.extend(user, mergedObj);
                            user.save(function(err){
                                if(err){
                                    throw err;
                                }
                                req.user = user;
                            });
                        } else {
                            //link the account and save
                            sessionUser = req.user;

                            //Set the fb data in the model
                            sessionUser.google.id = profile.id;
                            sessionUser.google.token = token;
                            sessionUser.google.displayName = profile.name.givenName + ' ' + profile.name.familyName;
                            sessionUser.google.email = profile.emails[0].value; //google returns a collection of emails.

                            //persistence is virture
                            sessionUser.save(function (err) {
                                if (err) {
                                    throw err;
                                }

                                //return user
                                return done(null, sessionUser);
                            });
                        }

                    } else {
                        //If they're not logged in, do it!
                        //first ensure the token is saved
                        user.google.token = token;
                        return done(null, user);
                    }

                } else {
                    if (req.user) {
                        //link the account and save
                        sessionUser = req.user;

                        //Set the fb data in the model
                        sessionUser.google.id = profile.id;
                        sessionUser.google.token = token;
                        sessionUser.google.displayName = profile.name.givenName + ' ' + profile.name.familyName;
                        sessionUser.google.email = profile.emails[0].value; //google returns a collection of emails.

                        //persistence is virture
                        sessionUser.save(function (err) {
                            if (err) {
                                throw err;
                            }

                            //return user
                            return done(null, sessionUser);
                        });

                    } else {
                        //create a new account
                        var newUser = new User();

                        //Set the fb data in the model
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.displayName = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.google.email = profile.emails[0].value; //google returns a collection of emails.

                        //persistence is virture
                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }

                            //return user
                            return done(null, newUser);
                        });
                    }
                }

            });
        });
    }));
}
