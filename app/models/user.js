// app/models/user.js
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.Types.ObjectId
    , bcrypt = require('bcrypt-nodejs')
    , uuid = require('node-uuid')
    , _ = require('underscore')

module.exports = function(){

    // define the schema
    var userSchema = Schema({
        local: {
            email: String,
            password: String,
            resetToken: String,
            resetTokenExpires: Date
        },
        facebook: {
            id: String,
            token: String,
            email: String,
            displayName: String
        },
        twitter: {
            id: String,
            token: String,
            displayName: String,
            username: String
        },
        google: {
            id: String,
            token: String,
            email: String,
            displayName: String
        },
        github: {
            id: String,
            token: String,
            email: String,
            displayName: String
        }
    });

// methods ================================================

// generating a hash
    userSchema.methods.generateHash = function(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(appGlobals.config.get('saltWorkFactor')), null);
    };

//Reset token for forgotten passwords
    userSchema.methods.generateResetToken = function(){
        return  uuid.v1();
    };

// check password against hash
    userSchema.methods.validPassword = function(password){
        return bcrypt.compareSync(password, this.local.password);
    }

//Merge two users together into one (solve duplicate accounts)
    userSchema.methods.generateMergedObject = function(mergeUser){
        var mergeUserObj = mergeUser.toObject({ getters: false, virtuals: false });
        var thisObj = this.toObject({ getters: false, virtuals: false });
        delete mergeUserObj._id;
        delete thisObj._id;
        return _.defaults(thisObj, mergeUserObj)
    };

    return userSchema;
}();