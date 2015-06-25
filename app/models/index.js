//Models Index
var mongoose = require('mongoose');

module.exports = function(){

    var userSchema = require('./user');

    return {
        "User": mongoose.model('User', userSchema)
    };
}
