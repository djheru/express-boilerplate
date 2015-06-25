//Development config
module.exports = {

    "database": {
        "url" : "mongodb://localhost/pae"
    },

    "email": {
        "transport": {
            "service": "Mailgun",
            "auth": {
                "user": "postmaster@ur-domain",
                "pass": "your password "
            }
        }
    },

    "auth": {
        "localAuth": {
            "usernameField": "email", //override default to use email as username
            "passwordField": "password",
            "passReqToCallback": true

        },
        "facebookAuth": {
            "clientID": "", // your App ID
            "clientSecret": "", // your App Secret
            "callbackURL": "http://localhost:3000/auth/facebook/callback", // url for callback
            "passReqToCallback": true
        },

        "twitterAuth": {
            "consumerKey": "",
            "consumerSecret": "",
            "callbackURL": "http://localhost:3000/auth/twitter/callback",
            "passReqToCallback": true
        },

        "googleAuth": {
            "clientID": "",
            "clientSecret": "",
            "callbackURL": "http://localhost:3000/auth/google/callback",
            "passReqToCallback": true
        },

        "githubAuth": {
            "clientID": "",
            "clientSecret": "",
            "callbackURL": "http://localhost:3000/auth/github/callback",
            "passReqToCallback": true
        }
    }
};