// Populate users with accounts
global.appGlobals   = {};
appGlobals.config   = require('../config')('development');

var models = require('../app/models')()
    , _ = require('underscore')
    , mongoose = require('mongoose')
    , moment = require('moment')
    , Chance = require('chance')
    , chance = new Chance();

module.exports = function(userId) {

    var seedGenerator = function(cb){

        cb(data);
    };

    var seeder = function(num) {
        seedGenerator(function(err, seeds){
            if(err){
                console.log(err)
            }
        });

    }

    return seeder;
};
