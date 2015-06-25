// Middleware to play with req and res before rendering the page
var _ = require('underscore'),
    models = require('../../models')();
module.exports = {

    "isLoggedIn": function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('dangerMessage', 'Please log in or connect to get access to secure pages.')
        res.redirect('/');
    },
    "csrfChecker": function (err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN') {
            return next(err);
        }

        // handle CSRF token errors here
        res.status(403)
        res.send('session has expired or form tampered with')
    },
    "logErrors": function (err, req, res, next)  {
        appGlobals.logger.error(err.stack);
        next(err);
    },
    "errorHandler": function (err, req, res, next) {
        res.status(500);
        res.render('error', { error: err });
    },
    "flashAlert": function (req, res, next) {
        var flashMessages = {};
        var messageTypes = ['success', 'info', 'warning', 'danger'];
        var type;
        _.each(messageTypes, function (msgType) {
            type = msgType + 'Message';
            flashMsg = req.flash(type)
            flashMessages[type] = (_.isArray(flashMsg)) ?
                flashMsg.join("\n<br />") : flashMsg;
        });
        res.locals.flashMessages = flashMessages;
        return next();
    },
    "flashForm": function (req, res, next) {
        var errors = req.flash('formErrors');
        res.locals.formErrors = function (fieldName) {
            return errors.indexOf(fieldName) >= 0;
        }
        return next();
    },
    "flashBody": function (req, res, next) {

        //cache the flash message containing the form data
        //and create a function to access it
        var flashMsg = req.flash('formBody'),
            formValue;

        //create a function to be called by the view
        //returns the value of a key in an object
        //the object is either the flashBody or the 2nd param
        res.locals.formBody = function (fieldName, dataObj) {
            dataObj = (dataObj) ? dataObj : {};
            if (flashMsg && flashMsg.length >  0) {
                formValue = _.property(fieldName)(flashMsg[0]);
                return (formValue) ? formValue : '';
            } else {
                formValue = _.property(fieldName)(dataObj);
                return (formValue) ? formValue : '';
            }
        }
        return next();
    }
}
