//Default configs
module.exports = {

    "app": {

        "name": "passport example",

        "description": "An example of user authentication and authorization using Passport.js",

        "url": "http://express-Boilerplate.com",

        "fromEmail": "test@onlinecuisine.com",

        "routes": {

            "passport": {
                "authProviders": [
                    "facebook",
                    "google",
                    "local",
                    "twitter",
                    "github"
                ],
                "authentication": "/auth/:provider",
                "authorization": "/link/:provider",
                "unlinking": "/unlink/:provider",
                "callback": "/auth/:provider/callback",
                "redirect": {
                    "successRedirect": "/profile",
                    "failureRedirect": "/"
                }
            },

            "protected": {
                "profile": "/profile",
                "link": "/profile/link",
                "redirect": {
                    "successRedirect": "/profile"
                }
            },

            "public": {
                "home": "/",
                "signup": "/signup",
                "login": "/login",
                "logout": "/logout",
                "forgot": "/forgot",
                "reset": "/reset/:resetToken",
                "redirect": {
                    "successRedirect": "/profile"
                }
            }
        }
    }
}
