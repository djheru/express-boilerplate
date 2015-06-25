//Github passport config
var _ = require('underscore');
var GithubStrategy = require('passport-github').Strategy;
var config = appGlobals.config.get('auth');
var logger = appGlobals.logger;

module.exports = function (passport, models){

    var User = models.User;

    // ====================================================
    // Github Strategy
    // ====================================================
    passport.use(new GithubStrategy(config.githubAuth, function (req, token, refreshToken, profile, done) {

        //asynchronous
        process.nextTick(function () {

            //Does this github user exist?
            User.findOne({'github.id': profile.id}, function (err, user) {

                if (err) {// oops there goes my shirt
                    return done(err);
                }
                var sessionUser;

                if (user) {

                    //if user exists, check if they're logged in
                    if (req.user) {
                        sessionUser = req.user;

                        //user user is logged in and has github already
                        //are logged in user and fb user the same?
                        //if yes link, otherwise merge and delete
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
                            sessionUser.github.id = profile.id;
                            sessionUser.github.token = token;
                            sessionUser.github.displayName = profile.displayName;
                            sessionUser.github.email = profile.emails[0].value; //github returns a collection of emails.

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
                        user.github.token = token;
                        return done(null, user);
                    }

                } else {
                    if (req.user) {
                        //link the account and save
                        sessionUser = req.user;

                        //Set the fb data in the model
                        sessionUser.github.id = profile.id;
                        sessionUser.github.token = token;
                        sessionUser.github.displayName = profile.displayName;
                        sessionUser.github.email = profile.emails[0].value; //github returns a collection of emails.

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
                        newUser.github.id = profile.id;
                        newUser.github.token = token;
                        newUser.github.displayName = profile.displayName;
                        newUser.github.email = profile.emails[0].value; //github returns a collection of emails.

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
