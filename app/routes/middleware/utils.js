var _ = require('underscore');
module.exports = {
    "validationUtility": function(req, res) {
        var errors = req.validationErrors();
        if (errors && errors.length > 0) {
            appGlobals.logger.error('Form validation errors', errors);
            req.flash('dangerMessage', _.pluck(errors, 'msg'));
            req.flash('formErrors', _.pluck(errors, 'param'));
            req.flash('formBody', req.body);
            return false
        }
        return true
    },

    //Return an error object similar to express-validate
    //Used for validation beyond express-validator
    "customValidationUtility": function(req, params, msgs){
        appGlobals.logger.error('Form validation errors', msgs);
        req.flash('dangerMessage', msgs);
        req.flash('formErrors', params);
        req.flash('formBody', req.body);
        return;
    }
}
