// Twitter Passport Config
var _ = require('underscore');
var TwitterStrategy = require('passport-twitter').Strategy;
var config = appGlobals.config.get('auth');
var logger = appGlobals.logger;


module.exports = function(passport, models){

    var User = models.User;

    // ====================================================
    // Twitter
    // ====================================================
    passport.use(new TwitterStrategy(config.twitterAuth, function (req, token, tokenSecret, profile, done) {

        //make the code asynchronous
        //User.findOne won't fire until the response from twitter is received
        process.nextTick(function () {

            //Does this twitter user exist?
            User.findOne({'twitter.id': profile.id}, function (err, user) {

                if (err) {// oops there goes my shirt
                    return done(err);
                }
                var sessionUser;
                if (user) {

                    //if user exists, check if they're logged in
                    if (req.user) {
                        sessionUser = req.user;

                        //user user is logged in and has twitter already
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
                            sessionUser.twitter.id = profile.id;
                            sessionUser.twitter.token = token;
                            sessionUser.twitter.username = profile.username;
                            sessionUser.twitter.displayName = profile.displayName; //twitter returns a collection of emails.

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
                        user.twitter.token = token;
                        return done(null, user);
                    }


                } else {
                    if (req.user) {
                        //link the account and save
                        sessionUser = req.user;

                        //Set the fb data in the model
                        sessionUser.twitter.id = profile.id;
                        sessionUser.twitter.token = token;
                        sessionUser.twitter.username = profile.username;
                        sessionUser.twitter.displayName = profile.displayName; //twitter returns a collection of emails.

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
                        newUser.twitter.id = profile.id;
                        newUser.twitter.token = token;
                        newUser.twitter.username = profile.username;
                        newUser.twitter.displayName = profile.displayName; //twitter returns a collection of emails.

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
