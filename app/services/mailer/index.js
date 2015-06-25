//email module

var nodemailer = require('nodemailer');
var wellknown = require('nodemailer-wellknown');
var config = appGlobals.config.get('email');

module.exports = function(){
    var mailer = {};

    mailer.send = function(fromEmail, toEmail, subject, msg, callback){

        var transport = nodemailer.createTransport(config.transport);

        var mailOptions = {
            from: fromEmail,
            to: toEmail,
            subject: subject,
            text: msg,
            html: msg
        };

        transport.sendMail(mailOptions, function(err){
            if(err){
                return callback(err, null);
            }
            transport.close();
            return callback(null, 'success');
        });
    }

    mailer.sendResetEmail = function(user, cb){
        var linkUrl = appGlobals.config.get('app').url + "/reset/" + user.local.resetToken;
        var subject = "Password reset request from " + appGlobals.config.get('app').fromEmail;
        var msg = "Hello, . Recently, someone requested that " + "your password from " +
            appGlobals.config.get('app').name + " be reset. If you did " +
            "not request this change, simply do nothing, and we won't change a thing. To " +
            "reset your password, click this link:  <a href=\"" + linkUrl +  "\">" + linkUrl + "</a>";
        mailer.send(appGlobals.config.get('fromEmail'), user.local.email, subject, msg, cb);
    }

    return mailer;
}
