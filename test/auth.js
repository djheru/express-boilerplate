var app = require('../server')
    , Session = require('supertest-session')({
        app: app,
        envs: {NODE_ENV: 'test'}
    })
    , _ = require('underscore')
    , should = require('should')
    , models = require('../app/models')()
    , $ = require('cheerio')
    , csrf = ''

    , loginUserData = {
        "email": "loginUser@blah.com",
        "password": "passwd"
    }
    , signupUserData = {
        "email": "signupUser@blah.com",
        "password": "passwd"
    }

describe('Authentication', function(){

    describe('Login Process', function(){

        before(function(){
            this.sess = new Session();
            var loginUser = new models.User();
            loginUser.local.email = loginUserData.email;
            loginUser.local.password = loginUser.generateHash(loginUserData.password);
            loginUser.save(function(err){
                if(err){
                    appGlobals.logger.info(err);
                    return;
                }
                appGlobals.logger.info('Adding a login user');
            })
        });

        after(function(){
            this.sess.destroy();
            models.User.remove({}, function(){
                appGlobals.logger.info('Cleaning up the db');
            });
        });

        it('should redirect to / when unauthenticated and attempting to access /profile', function(done){
            var sess = this.sess;
            this.sess
                .get('/profile')
                .end(function(err, res){
                    should.not.exist(err);
                    var sessionCookie = _.find(sess.cookies, function(cookie){
                        return _.has(cookie, 'connect.sid');
                    });
                    sessionCookie.should.have.property('connect.sid');
                    res.header.should.have.property('location', '/');
                    done();
                });
        });

        it('should display a form to log in', function(done){
            var sess = this.sess;
            this.sess
                .get('/login')
                .expect(200)
                .end(function(err, res){
                    should.not.exist(err);
                    var sessionCookie = _.find(sess.cookies, function(cookie){
                        return _.has(cookie, 'connect.sid');
                    });
                    sessionCookie.should.have.property('connect.sid');
                    res.should.have.property('text');
                    var $html = $(res.text);
                    csrf = $html.find('#csrf').val();
                    csrf.should.not.be.empty;
                    done();
                });
        });

        it('should fail to authenticate when submitting to /login with no data', function(done){
            var sess = this.sess;
            this.sess
                .post('/login')
                .send({
                    "_csrf": csrf,
                    "email": "",
                    "password": ""
                })
                .expect(302)
                .end(function(err, res){
                    res.text.should.containEql('Moved Temporarily');
                    done();
                });
        });

        it('should fail to authenticate when submitting to /login with no email', function(done){
            var sess = this.sess;
            this.sess
                .post('/login')
                .send({
                    "_csrf": csrf,
                    "email": "",
                    "password": loginUserData.password
                })
                .expect(302)
                .end(function(err, res){
                    res.text.should.containEql('Moved Temporarily');
                    done();
                });
        });

        it('should fail to authenticate when submitting to /login with no password', function(done){
            var sess = this.sess;
            this.sess
                .post('/login')
                .send({
                    "_csrf": csrf,
                    "email": loginUserData.email,
                    "password": ""
                })
                .expect(302)
                .end(function(err, res){
                    res.text.should.containEql('Moved Temporarily');
                    done();
                });
        });

        it('should fail to authenticate when submitting to /login with invalid email', function(done){
            var sess = this.sess;
            this.sess
                .post('/login')
                .send({
                    "_csrf": csrf,
                    "email": "something.com",
                    "password": loginUserData.password
                })
                .expect(302)
                .end(function(err, res){
                    res.text.should.containEql('Moved Temporarily');
                    done();
                });
        });

        it('should fail to authenticate when submitting to /login with invalid CSRF token', function(done){
            var sess = this.sess;
            this.sess
                .post('/login')
                .expect(403)
                .send({
                    "_csrf": "LOLCSRF",
                    "email": loginUserData.email,
                    "password": loginUserData.password
                })
                .end(function(err, res){
                    should.exist(res.error);
                    res.should.have.property('text', 'session has expired or form tampered with')
                    done();
                });
        });

        it('should authenticate when submitting to /login with valid data', function(done){
            var sess = this.sess;
            this.sess
                .post('/login')
                .send({
                    "_csrf": csrf,
                    "email": loginUserData.email,
                    "password": loginUserData.password
                })
                .end(function(err, res){
                    should.not.exist(err);
                    var sessionCookie = _.find(sess.cookies, function(cookie){
                        return _.has(cookie, 'connect.sid');
                    });
                    sessionCookie.should.have.property('connect.sid');
                    res.header.location.should.containEql('/profile')
                    done();
                });
        });

        it('should log out when navigating to /logout', function(done){
            var sess = this.sess;
            this.sess
                .get('/logout')
                .end(function(err, res){
                    should.not.exist(err);
                    var sessionCookie = _.find(sess.cookies, function(cookie){
                        return _.has(cookie, 'connect.sid');
                    });
                    sessionCookie.should.have.property('connect.sid');
                    res.header.should.have.property('location', '/');
                    done();
                });
        });
    });

    describe('Signup Process', function(){

        before(function(){
            this.sess = new Session();
        });

        after(function(){
            this.sess.destroy();
            models.User.remove({}, function(){
                appGlobals.logger.info('Cleaning up the db');
            });
        });

        it('should display a form to sign up', function(done){
            var sess = this.sess;
            this.sess
                .get('/signup')
                .expect(200)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.have.property('text');
                    var $html = $(res.text);
                    csrf = $html.find('#csrf').val();
                    csrf.should.not.be.empty;
                    done();
                });
        });

        it('should fail to create a user when submitting to /signup with no data', function(done){
            var sess = this.sess;
            this.sess
                .post('/signup')
                .send({
                    "_csrf": csrf,
                    "email": "",
                    "password": ""
                })
                .end(function(err, res){
                    should.not.exist(err);
                    var sessionCookie = _.find(sess.cookies, function(cookie){
                        return _.has(cookie, 'connect.sid');
                    });
                    sessionCookie.should.have.property('connect.sid');
                    res.header.location.should.containEql('/signup')
                    done();
                });
        });

        it('should fail to create a user when submitting to /signup with no email address', function(done){
            var sess = this.sess;
            this.sess
                .post('/signup')
                .send({
                    "_csrf": csrf,
                    "email": "",
                    "password": signupUserData.password
                })
                .end(function(err, res){
                    should.not.exist(err);
                    var sessionCookie = _.find(sess.cookies, function(cookie){
                        return _.has(cookie, 'connect.sid');
                    });
                    sessionCookie.should.have.property('connect.sid');
                    res.header.location.should.containEql('/signup')
                    done();
                });
        });

        it('should fail to create a user when submitting to /signup with no password', function(done){
            var sess = this.sess;
            this.sess
                .post('/signup')
                .send({
                    "_csrf": csrf,
                    "email": signupUserData.email,
                    "password": ""
                })
                .end(function(err, res){
                    should.not.exist(err);
                    var sessionCookie = _.find(sess.cookies, function(cookie){
                        return _.has(cookie, 'connect.sid');
                    });
                    sessionCookie.should.have.property('connect.sid');
                    res.header.location.should.containEql('/signup')
                    done();
                });
        });

        it('should fail to create a user when submitting to /signup with invalid email', function(done){
            var sess = this.sess;
            this.sess
                .post('/signup')
                .send({
                    "_csrf": csrf,
                    "email": "someuser",
                    "password": signupUserData.password
                })
                .end(function(err, res){
                    should.not.exist(err);
                    var sessionCookie = _.find(sess.cookies, function(cookie){
                        return _.has(cookie, 'connect.sid');
                    });
                    sessionCookie.should.have.property('connect.sid');
                    res.header.location.should.containEql('/signup')
                    done();
                });
        });

        it('should fail to create a user when submitting to /signup with invalid CSRF token', function(done){
            var sess = this.sess;
            this.sess
                .post('/signup')
                .send({
                    "_csrf": "LOLCSRF",
                    "email": signupUserData.email,
                    "password": signupUserData.password
                })
                .expect(403)
                .end(function(err, res){
                    should.exist(res.error);
                    res.should.have.property('text', 'session has expired or form tampered with')
                    done();
                });
        });

        it('should create a new user when submitting to /signup with valid data', function(done){
            var sess = this.sess;
            this.sess
                .post('/signup')
                .send({
                    "_csrf": csrf,
                    "email": signupUserData.email,
                    "password": signupUserData.password
                })
                .end(function(err, res){
                    should.not.exist(err);
                    var sessionCookie = _.find(sess.cookies, function(cookie){
                        return _.has(cookie, 'connect.sid');
                    });
                    sessionCookie.should.have.property('connect.sid');
                    res.header.location.should.containEql('/profile')
                    done();
                });
        });

        it('should redirect from /signup to /profile when already signed in', function(done){
            var sess = this.sess;
            this.sess
                .get('/signup')
                .end(function(err, res){
                    should.not.exist(err);
                    var sessionCookie = _.find(sess.cookies, function(cookie){
                        return _.has(cookie, 'connect.sid');
                    });
                    sessionCookie.should.have.property('connect.sid');
                    res.header.location.should.containEql('/profile')
                    done();
                });
        });

    });

});
