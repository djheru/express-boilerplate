// Session setup for Passport Serialization
module.exports = function(passport, models){

    var User = models.User;

    // ====================================================
    // Passport session setup
    // ====================================================
    // Required for persistent login sessions
    // Passport needs to be able to serialize/deserialize users

    // serialize
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // deserialize
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}
