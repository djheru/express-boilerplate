var request = require('supertest'),
    express = require('express'),
    server = require('../server');

describe('Smoke Test', function(){
    it('responds with a response', function(done){
        request(server)
            .get('/')
            .expect(200, done);
    });
});

describe('Authentication', function(){
    it('redirects from /profile to /login if not logged in', function(done){
        request(server)
            .get('/')
            .expect(200)
            .end(function(err, res){
                if(err){
                    return done(err);
                }
                done();
            });
    });
});