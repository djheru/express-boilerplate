//Handler for protected routes
var utils = require('../middleware/utils');
module.exports = function (express, passport, config) {
    return {
        "params": {},

        //You can't even see me
        "profile": {
            "get": function (req, res) {
                if(process.env.SEED && process.env.SEED == 1) {
                    var devSeeder = require('./../../../scripts/populate')(req.user._id);
                    devSeeder(18);
                }
                res.render('profile.ejs', {});
            }
        },
        "link": {
            "get": function (req, res) {
                res.render('profile-link.ejs', {
                    csrfToken: req.csrfToken()
                });
            }
        }
    }
}
