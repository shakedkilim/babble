'use strict';

var module = require('./testedServer');
var assert = require('assert');

var chai = require('chai')
  , chaiHttp = require('chai-http');

chai.use(chaiHttp);

var expect = chai.expect;

// test server


describe('Check server listening functions:', function() {

        beforeEach(function() {

                // runs before each test in this block

                module.server.listen(9098);                


        });

        describe('Check adding users functionality:', function() {

                it('Should add a new user named Russell Crowe', function(done) {

                        chai.request('http://localhost:9098')
                                .post('/')
                                .type('form')
                                .send({
                                'poll0,1/Russell Crowe.': '' 
                                }).end(function(err,res){
                                        expect(res).to.have.status(200);
                                        assert.equal(module.Babble.userCount,1,"Error: test has failed - counter isn't right");
                                        assert.equal((module.Babble.users).includes("Russell Crowe"),true,"Error: test has failed - name Russell Crowe doesn't exist");
                                        done();
                                });
                        
                });

                it('Should add a new user named Joaquin Phoenix', function(done) {

                        chai.request('http://localhost:9098')
                                .post('/')
                                .type('form')
                                .send({
                                'poll0,1/Joaquin Phoenix.': '' 
                                }).end(function(err,res){
                                        expect(res).to.have.status(200);
                                        assert.equal(module.Babble.userCount,2,"Error: test has failed - counter isn't right");
                                        assert.equal((module.Babble.users).includes("Joaquin Phoenix"),true,"Error: test has failed - name Joaquin Phoenix doesn't exist");
                                        done();
                                });
                                
                });

                it('Should add a new user named Oliver Reed', function(done) {

                        chai.request('http://localhost:9098')
                                .post('/')
                                .type('form')
                                .send({
                                'poll0,1/Oliver Reed.': '' 
                                }).end(function(err,res){
                                        expect(res).to.have.status(200);
                                        assert.equal(module.Babble.userCount,3,"Error: test has failed - counter isn't right");
                                        assert.equal((module.Babble.users).includes("Joaquin Phoenix"),true,"Error: test has failed - name Joaquin Phoenix doesn't exist");
                                        done();
                                });
                                
                });

                it('Should add a new user named Annonymous', function(done) {

                        chai.request('http://localhost:9098')
                                .post('/')
                                .type('form')
                                .send({
                                'poll0,1/Annonymous.': '' 
                                }).end(function(err,res){
                                        expect(res).to.have.status(200);
                                        assert.equal(module.Babble.userCount,4,"Error: test has failed - counter isn't right");
                                        assert.equal((module.Babble.users).includes("Annonymous"),true,"Error: test has failed - name Annonymous doesn't exist");
                                        done();
                                });
                                
                });

        });
        describe('Check removing users functionality:', function() {

                it('Should remove a user named Joaquin Phoenix', function(done) {

                        chai.request('http://localhost:9098')
                                .post('/')
                                .type('form')
                                .send({
                                'poll0,1/Joaquin Phoenix.-': '' 
                                }).end(function(err,res){
                                        expect(res).to.have.status(200);
                                        assert.equal(module.Babble.userCount,3,"Error: test has failed - counter isn't right");
                                        assert.equal((module.Babble.users).includes("Joaquin Phoenix"),false,"Error: test has failed - name Joaquin Phoenix doesn't exist");
                                        done();
                                });
                                
                });

        });

        describe('Check adding messages functionality:', function() {

                it('Should add a new message', function(done) {

                        chai.request('http://localhost:9098')
                                .post('/')
                                .type('form')
                                .send({
                                name: 'Annonymous',
                                text: 'Hello World!!!',
                                time: '17:25',
                                link: 'https://pbs.twimg.com/profile_images/453956388851445761/8BKnRUXg.png'
                                }).end(function(err,res){
                                        expect(res).to.have.status(200);
                                        assert.equal(module.Babble.messages.length,1,"Error: test has failed - message counter isn't right");
                                        done();
                                });
                                
                });

                it('Should add another new message', function(done) {

                        chai.request('http://localhost:9098')
                                .post('/')
                                .type('form')
                                .send({
                                name: 'Annonymous',
                                text: 'Hello!!!',
                                time: '17:35',
                                link: 'https://pbs.twimg.com/profile_images/453956388851445761/8BKnRUXg.png'
                                }).end(function(err,res){
                                        expect(res).to.have.status(200);
                                        assert.equal(module.Babble.messages.length,2,"Error: test has failed - message counter isn't right");
                                        done();
                                });
                                
                });

        });


        describe('Check removing messages functionality:', function() {

                it('Should remove hello message', function(done) {

                        chai.request('http://localhost:9098')
                                .post('/')
                                .type('form')
                                .send({
                                'poll2,1/Annonymous.$0': ''
                        }).end(function(err,res){
                                        expect(res).to.have.status(200);
                                        assert.equal((module.Babble.messages).length,1,"Error: test has failed - message counter isn't right");
                                        done();
                        });
                                
                });

                it('Should not remove hello world message from a user that is not logged in', function(done) {

                        chai.request('http://localhost:9098')
                                .post('/')
                                .type('form')
                                .send({
                                'poll2,1/Tony Stark.$0': ''
                        }).end(function(err,res){
                                        expect(res).to.have.status(200);
                                        assert.equal((module.Babble.messages).length,1,"Error: test has failed - message counter isn't right");
                                        done();
                        });
                                
                });


        });

        

        afterEach(function() {

                // runs after each test in this block
                
                module.server.close();

        });

    });

    describe('Check receiving data from server:', function() {

        //var resp;

                beforeEach(function() {

                        module.server.listen(9099);

                });

                it('Should receive a non-null object containing the chat logs', function(done) {

                        chai.request('http://localhost:9099')
                                .post('/')
                                .send(
                                'poll0,0/Annonymous.'
                        ).end(function(err,res){
                                        expect(res).to.have.status(200);
                                        assert.equal(res.text != null,true,"Error: test has failed - server response is null");
                                        done();
                        });
                                
                });

                afterEach(function() {

                        // runs after each test in this block
                        
                        module.server.close();

                });

        });