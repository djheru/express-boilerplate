//Facebook passport config
var _ = require('underscore');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = appGlobals.config.get('auth');
var logger = appGlobals.logger;

module.exports = function (passport, models){

    var User = models.User;

    // ====================================================
    // Facebook Strategy
    // ====================================================
    passport.use(new FacebookStrategy(config.facebookAuth, function (req, token, refreshToken, profile, done) {

        //asynchronous
        process.nextTick(function () {

            //Does this facebook user exist?
            User.findOne({'facebook.id': profile.id}, function (err, user) {

                if (err) {// oops there goes my shirt
                    return done(err);
                }
                var sessionUser;

                if (user) {

                    //if user exists, check if they're logged in
                    if (req.user) {
                        sessionUser = req.user;

                        //user user is logged in and has facebook already
                        //are logged in user and fb user the same?
                        //if no merge and delete, otherwise link
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
                            sessionUser.facebook.id = profile.id;
                            sessionUser.facebook.token = token;
                            sessionUser.facebook.displayName = profile.displayName;
                            sessionUser.facebook.email = profile.emails[0].value; //facebook returns a collection of emails.

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
                        //If they're not logged in, log them in
                        //first ensure the token is saved
                        user.facebook.token = token;
                        return done(null, user);
                    }

                } else {
                    if (req.user) {
                        //link the account and save
                        sessionUser = req.user;

                        //Set the fb data in the model
                        sessionUser.facebook.id = profile.id;
                        sessionUser.facebook.token = token;
                        sessionUser.facebook.displayName = profile.displayName;
                        sessionUser.facebook.email = profile.emails[0].value; //facebook returns a collection of emails.

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
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.displayName = profile.displayName;
                        newUser.facebook.email = profile.emails[0].value; //facebook returns a collection of emails.

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
