//Development secure config
module.exports = {

    "database": {
        "url" : "mongodb://localhost/expressApp"
    },

    "email": {
        "transport": {
            "service": "Mailgun",
            "auth": {
                "user": "postmaster@online.com",
                "pass": "asdf"
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
            "clientID": "1423453459639392", // your App ID
            "clientSecret": "53d03df123412345a1e938b096", // your App Secret
            "callbackURL": "http://localhost:3000/auth/facebook/callback", // url for callback
            "passReqToCallback": true
        },

        "twitterAuth": {
            "consumerKey": "JMRFBuBYfsdfgsdyCqucIhqX",
            "consumerSecret": "sdfggsdfgsdfgsdfgsdfgsdfgsFhL9ujRBSL3raqW",
            "callbackURL": "http://localhost:3000/auth/twitter/callback",
            "passReqToCallback": true
        },

        "googleAuth": {
            "clientID": "935345345351-2uj4hhevpip23dhq3joqss755vcndns9.apps.googleusercontent.com",
            "clientSecret": "jxsdfgM58iIGQqGRgpiPb",
            "callbackURL": "http://localhost:3000/auth/google/callback",
            "passReqToCallback": true
        },

        "githubAuth": {
            "clientID": "f3e4c4334534345589",
            "clientSecret": "efe4de3e30b0345346c8741829bc7b4277db",
            "callbackURL": "http://localhost:3000/auth/github/callback",
            "passReqToCallback": true
        }
    }
};
