'use strict';

let assert = require('assert');
let messages = require('../../server/messages-util');

describe('Message', function() {
  it('should load the messages module', function() {
    assert.notEqual(null, messages);
  });
  it('should be able to add a new message and return id', function() {
    let message = {message: '1'};
    let id = messages.addMessage(message);
    assert.notEqual(null, id);
  });
  it('should return new messages', function() {
    let all = messages.getMessages(0);
    let newMessage = {message: '2'};
    messages.addMessage(newMessage);
    let newMessages = messages.getMessages(all.length);
    assert.deepEqual(newMessages, [newMessage]);
  });
  it('should be able to delete a message', function() {
    let message = {message: '3'};
    let id = messages.addMessage(message);
    messages.deleteMessage(id);
    assert.equal(null, messages.getMessages(0).find(m => m.id === id));
  });
});

var module = require('./testedServer');

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
                                .get('/login?username=Russell Crowe')
                                .end(function(err,res){
                                        expect(res).to.have.status(200);
                                        assert.equal(module.Babble.userCount,1,"Error: test has failed - counter isn't right");
                                        assert.equal((module.Babble.users).includes("Russell Crowe"),true,"Error: test has failed - name Russell Crowe doesn't exist");
                                        done();
                                });
                        
                });

                it('Should add a new user named Joaquin Phoenix', function(done) {

                        chai.request('http://localhost:9098')
                                .get('/login?username=Joaquin Phoenix')
                                .end(function(err,res){
                                        expect(res).to.have.status(200);
                                        assert.equal(module.Babble.userCount,2,"Error: test has failed - counter isn't right");
                                        assert.equal((module.Babble.users).includes("Joaquin Phoenix"),true,"Error: test has failed - name Joaquin Phoenix doesn't exist");
                                        done();
                                });
                                
                });

                it('Should add a new user named Oliver Reed', function(done) {

                        chai.request('http://localhost:9098')
                                .get('/login?username=Oliver Reed') 
                                .end(function(err,res){
                                        expect(res).to.have.status(200);
                                        assert.equal(module.Babble.userCount,3,"Error: test has failed - counter isn't right");
                                        assert.equal((module.Babble.users).includes("Joaquin Phoenix"),true,"Error: test has failed - name Joaquin Phoenix doesn't exist");
                                        done();
                                });
                                
                });

                it('Should add a new user named Annonymous', function(done) {

                        chai.request('http://localhost:9098')
                                .get('/login?username=Annonymous')  
                                .end(function(err,res){
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
                                .get('/logout?username=Joaquin Phoenix')
                                .end(function(err,res){
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
                                .post('/messages')
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
                                .post('/messages')
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
                        .delete('/messages/0')              
                        .end(function(err,res){
                                        expect(res).to.have.status(200);
                                        assert.equal((module.Babble.messages).length,1,"Error: test has failed - message counter isn't right");
                                        done();
                        });
                                
                });

        });

        describe('Check stats reuqests:', function() {

                it('Should return stats', function(done) {

                        chai.request('http://localhost:9098')
                        .get('/stats')              
                        .end(function(err,res){
                                        expect(res).to.have.status(200);
                                        assert.deepEqual(JSON.parse(res.text),{ users: 3, messages: 1 },"Error: test has failed - Stats aren't right");
                                        done();
                        });
                                
                });

        });

        describe('request Check reuqest errors:', function() {

                it('/hello Should return 404', function(done) {

                        chai.request('http://localhost:9098')
                        .get('/hello')              
                        .end(function(err,res){
                                        expect(res).to.have.status(404);
                                        done();
                        });
                                
                });

                it('/moshe request Should return 404', function(done) {

                        chai.request('http://localhost:9098')
                        .get('/moshe')              
                        .end(function(err,res){
                                        expect(res).to.have.status(404);
                                        done();
                        });
                                
                });

                it('Should return 400', function(done) {

                        chai.request('http://localhost:9098')
                        .get('/messages?shuki =5')              
                        .end(function(err,res){
                                        expect(res).to.have.status(400);
                                        done();
                        });
                                
                });

                it('Another checkup: should return 400', function(done) {

                        chai.request('http://localhost:9098')
                        .get('/messages?counter=hello')              
                        .end(function(err,res){
                                        expect(res).to.have.status(400);
                                        done();
                        });
                                
                });

                it('check options request: should return 204', function(done) {

                        chai.request('http://localhost:9098')
                        .options('/messages?counter=hello')              
                        .end(function(err,res){
                                        expect(res).to.have.status(204);
                                        done();
                        });
                                
                });

                it('Check method not allowed: POST with /stats. HTTP method is bad for certain URL. should return 405', function(done) {

                        chai.request('http://localhost:9098')
                        .post('/stats')
                        .send({})              
                        .end(function(err,res){
                                        expect(res).to.have.status(405);
                                        done();
                        });
                                
                });

                it('Another check method not allowed: POST with counter HTTP method is bad for certain URL. should return 405', function(done) {

                        chai.request('http://localhost:9098')
                        .post('/messages?counter=1')
                        .send({})              
                        .end(function(err,res){
                                        expect(res).to.have.status(405);
                                        done();
                        });
                                
                });

                

                it('Check GET with /messages. should return 405', function(done) {

                        chai.request('http://localhost:9098')
                        .get('/messages')              
                        .end(function(err,res){
                                        expect(res).to.have.status(405);
                                        done();
                        });
                                
                });

                it('Check DELETE with /stats. should return 405', function(done) {

                        chai.request('http://localhost:9098')
                        .delete('/stats')              
                        .end(function(err,res){
                                        expect(res).to.have.status(405);
                                        done();
                        });
                                
                });

                it('Check DELETE with counter. should return 405', function(done) {

                        chai.request('http://localhost:9098')
                        .delete('/messages?counter=1')              
                        .end(function(err,res){
                                        expect(res).to.have.status(405);
                                        done();
                        });
                                
                });

                it('Check DELETE with /messages. should return 405', function(done) {

                        chai.request('http://localhost:9098')
                        .delete('/messages')              
                        .end(function(err,res){
                                        expect(res).to.have.status(405);
                                        done();
                        });
                                
                });

                it('Check POST with /messages/id . should return 405', function(done) {

                        chai.request('http://localhost:9098')
                        .post('/messages/1')
                        .send({})              
                        .end(function(err,res){
                                        expect(res).to.have.status(405);
                                        done();
                        });
                                
                });

                it('Check GET with /messages/id should return 405', function(done) {

                        chai.request('http://localhost:9098')
                        .get('/messages/1')              
                        .end(function(err,res){
                                        expect(res).to.have.status(405);
                                        done();
                        });
                                
                });


        });


        

        afterEach(function() {

                // runs after each test in this block
                
                module.server.close();

        });

    });
