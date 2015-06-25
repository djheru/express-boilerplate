//Route Handlers

module.exports = function (express, passport, models, mailer, config) {

    return {

        "public": require('./public')(express, passport, models, mailer, config),
        "passport": require('./passport')(express, passport, config),
        "protected": require('./protected')(express, passport, config)
    }
}
