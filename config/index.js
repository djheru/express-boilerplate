//config module

var fs = require("fs"),
    _ = require("underscore");

var supportedEnvironments = [
    "development",
    "production",
    "test"
];

module.exports = function(env){

    var accessor = {};
    var config = require("./default.js");

    if(supportedEnvironments.indexOf(env) < 0){
        console.log('Invalid environment: ' + env + '. Using development');
        env = 'development';
    }
    process.env.NODE_ENV = env;

    var file = "./" + env.toLowerCase() + ".js";
    var loadConfig = require(file);
    _.extend(config, loadConfig);

    var secureFile = "./secure/" + env.toLowerCase() + ".js";
    var loadConfig = require(secureFile);
    _.extend(config, loadConfig);

    accessor.get = function(key){
        return (_.has(config, key)) ? config[key] : null;
    }
    accessor.configData = config;
    return accessor;
}
