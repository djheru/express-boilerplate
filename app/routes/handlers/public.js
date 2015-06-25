//Public route handler
var _ = require('underscore');
var utils = require('../middleware/utils');
module.exports = function (express, passport, models, mailer, config) {
    return {

        //Token for password reset
        "params": {
            "resetToken": function (req, res, next, resetToken) {
                req.resetToken = resetToken;
                next();
            }
        },

        //Home page
        "home": {
            "get": function (req, res) {
                res.render('index.ejs', {});
            }
        },

        //Sign up for a local account
        "signup": {
            "get": function (req, res) {
                if (req.isAuthenticated()) {
                    res.redirect(config.public.redirect.successRedirect)
                } else {
                    res.render('signup.ejs', {
                        csrfToken: req.csrfToken()
                    });
                }
            },
            "post": function (req, res, next) {
                req.checkBody('email', 'Please enter a valid email').isEmail();
                req.checkBody('password', 'Please enter your password').notEmpty();

                //Validation failed
                if (!utils.validationUtility(req, res)) {
                    return res.redirect(config.public.signup);
                }

                //Authenticate
                passport.authenticate('local-signup', function (err, user, info) {
                    if (err) { //error
                        return next(err);
                    }
                    if (!user) {//user not authenticated
                        return res.redirect('back');
                    }

                    req.login(user, function(err){
                        return res.redirect(config.public.redirect.successRedirect);
                    });
                })(req, res, next);
            }
        },
        "login": {
            "get": function (req, res) {
                if (req.isAuthenticated()) {
                    res.redirect(config.public.redirect.successRedirect)
                } else {
                    res.render('login.ejs', {
                        csrfToken: req.csrfToken()
                    });
                }
            },
            "post": function (req, res, next) {

                req.checkBody('email', 'Please enter a valid email').isEmail();
                req.checkBody('password', 'Please enter a password').notEmpty();

                if (!utils.validationUtility(req, res)) {
                    return res.redirect('back');
                }

                passport.authenticate('local-login', {
                    successRedirect: config.public.redirect.successRedirect,
                    failureRedirect: config.public.login,
                    failureFlash: true
                })(req, res, next);
            }
        },
        "logout": {
            "all": function (req, res) {
                req.logout();
                res.redirect(config.public.home);
            }
        },
        "forgot": {
            "get": function (req, res) {
                if (req.isAuthenticated()) {
                    res.redirect(config.public.redirect.successRedirect)
                } else {
                    res.render('forgot.ejs', {
                        csrfToken: req.csrfToken()
                    });
                }
            },
            "post": function (req, res, next) {
                if (req.user) {
                    req.flash('infoMessage', 'You are already logged in.');
                    return res.redirect(config.public.redirect.successRedirect);
                }

                req.checkBody('email', 'Please enter a valid email').isEmail();
                if (!utils.validationUtility(req, res)) {
                    return res.redirect('back');
                }

                models.User.findOne({'local.email': req.body.email}, function (err, user) {
                    if (err) {
                        return next(err);
                    }

                    if (!user) {
                        var errMsgs = ['No user with that email exists'];
                        var params = ['email'];
                        utils.customValidationUtility(req, params, errMsgs);
                        return res.redirect('back');
                    }

                    user.local.resetToken = user.generateResetToken();
                    user.local.resetTokenExpires = new Date(Date.now() + appGlobals.config.get('tokenExpiration'));
                    user.save(function (err) {
                        if (err) {
                            return next(err)
                        }
                        mailer.sendResetEmail(user, function (err, result) {
                            if (err) {
                                req.flash('dangerMessage', 'There was a problem sending your reset email. Please try again later');
                                return res.redirect(config.public.home);
                            }
                            req.flash('successMessage', 'Please check your email for the link to reset your password.');
                            return res.redirect(config.public.login);
                        });
                    });
                });
            }
        },
        "reset": {
            "get": function (req, res) {
                if (req.isAuthenticated()) {
                    res.redirect(config.public.redirect.successRedirect)
                } else {
                    res.render('reset.ejs', {
                        csrfToken: req.csrfToken(),
                        resetToken: req.resetToken
                    });
                }
            },
            "post": function (req, res, next) {

                req.checkBody('email', 'Please enter a valid email').isEmail();
                req.checkBody('password', 'Please enter your new password').notEmpty();

                if (!utils.validationUtility(req, res)) {
                    return res.redirect('back');
                }

                models.User.findOne({
                    'local.email': req.body.email,
                    'local.resetToken': req.resetToken
                }, function (err, user) {
                    if (err) {
                        return next(err)
                    }

                    if (!user) {
                        var errMsgs = ['That email could not be located'];
                        var params = ['email'];
                        utils.customValidationUtility(req, params, errMsgs);
                        return res.redirect('back');
                    }
                    user.local.resetToken = '';
                    user.local.password = user.generateHash(req.body.password);
                    user.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        req.login(user, function (err) {
                            if (err) {
                                return next(err);
                            }
                            req.flash('successMessage', 'Your password was successfully reset');
                            res.redirect(config.public.redirect.successRedirect);
                        });
                    })

                });
            }
        }
    }
};
