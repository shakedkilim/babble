'use strict';

let assert = window.chai.assert;
let sinon = window.sinon;
let Babble = window.Babble;

describe('LocalStorage', function() {
  it('should have one key named babble in json format', function() {
    let keys = Object.keys(localStorage);
    assert.equal(keys.length, 1);
    assert.deepEqual(keys, ['babble']);

    let data = localStorage.getItem('babble');
    assert.doesNotThrow(JSON.parse.bind(JSON, data));
  });
  it('should have mandatory keys', function() {
    let data = JSON.parse(localStorage.getItem('babble'));
    assert.exists(data.userInfo);
    assert.exists(data.currentMessage);
    assert.exists(data.userInfo.name);
    assert.exists(data.userInfo.email);
  });
});


describe('User state', function() {
  let originalValue;
  before(function() {
    originalValue = localStorage.getItem('babble');
  });
  after(function() {
    localStorage.setItem('babble', originalValue);
  });
  it('should be empty before registering', function() {
    let data = JSON.parse(localStorage.getItem('babble'));
    assert.isEmpty(data.userInfo.name);
    assert.isEmpty(data.userInfo.email);
  });
  it('should have details after register', function() {
    Babble.register({
      name: 'Alex Krul',
      email: 'alex@krul.co.il'
    });
    let data = JSON.parse(localStorage.getItem('babble'));
    assert.equal(data.userInfo.name, 'Alex Krul');
    assert.equal(data.userInfo.email, 'alex@krul.co.il');
  });
  it('should allow anonymous register', function() {
    Babble.register({
      name: '',
      email: ''
    });
    let data = JSON.parse(localStorage.getItem('babble'));
    assert.empty(data.userInfo.name);
    assert.empty(data.userInfo.email);
  });
});

describe('Client-Server', function() {
  let server, apiUrl;

  before(function() {
    apiUrl = 'http://localhost:9000';
    server = sinon.fakeServer.create();
  });
  beforeEach(function() {
    server.requests.length = 0;
  });
  after(function() {
    server.restore();
  });

  describe('API', function() {
    it('should issue GET /messages ', function() {
      server.respondWith('GET', `${apiUrl}/messages?counter=0`, JSON.stringify([]));
      let callback = sinon.spy();
      Babble.getMessages(0, callback);
      server.respond();
      sinon.assert.calledWith(callback, []);
    });
    it('should issue POST /messages ', function() {
      server.respondWith('POST', `${apiUrl}/messages`, JSON.stringify({id: '42'}));
      let callback = sinon.spy();
      let message = {
        name: 'Alex Krul',
        email: 'alex@krul.co.il',
        message: 'Hi from mocha',
        timestamp: Date.now()
      };
      Babble.postMessage(message, callback);
      server.respond();
      assert.equal(server.requests[0].requestBody, JSON.stringify(message));
      sinon.assert.calledWith(callback, {id: '42'});
    });
    it('should issue DELETE /messages/:id ', function() {
      server.respondWith('DELETE', `${apiUrl}/messages/42`, JSON.stringify(true));
      let callback = sinon.spy();
      Babble.deleteMessage('42', callback);
      server.respond();
      sinon.assert.calledWith(callback, true);
    });
    it('should issue GET /stats ', function() {
      server.respondWith('GET', `${apiUrl}/stats`, JSON.stringify({users: 5, messages: 20}));
      let callback = sinon.spy();
      Babble.getStats(callback);
      server.respond();
      sinon.assert.calledWith(callback, {users: 5, messages: 20});
    });
  });
});

describe('Test Client', function() {

    describe('Check appendProfileImg', function() {
        it('Should append image', function() {
                
                var figure = document.createElement("figure");
                document.querySelector("body").appendChild(figure);    

                var link = "4a9ee3b48dd55d2edd0224cda8640d21"; // mail hashed by MD5

                appendProfileImg(figure,link);
                
                expect( figure.firstChild.tagName.toLowerCase() ).to.equal("img");
        });
    });

    describe('Check functions for adjusting textarea', function() {

        it('Should resize textarea', function() {

            var textarea = document.getElementById("js-textArea");
            var oldSize = textarea.offsetHeight;

            textarea.addEventListener("keypress", function(event){

                //expect().to.equal();
                expect(event.eventKey !== 13 || textarea.offsetHeight !== oldSize).to.equal(true);
                oldSize = textarea.offsetHeight;

             });

        });

        it('Should resize form', function() {

            var formElement = document.getElementById("js-form-footer");
            var oldSize = formElement.offsetHeight;

            formElement.addEventListener("keypress", function(event){

                expect(event.eventKey !== 13 || formElement.offsetHeight !== oldSize).to.equal(true);
                oldSize = formElement.offsetHeight;
                
             });

        });

        it('Should resize form', function() {

            var footerElement = document.getElementById("js-page-footer");
            var oldSize = footerElement.offsetHeight;

            footerElement.addEventListener("keypress", function(event){

                expect(event.eventKey !== 13 || footerElement.offsetHeight !== oldSize).to.equal(true);
                oldSize = footerElement.offsetHeight;
                
             });

        });

    });
    

    describe('Check serialize', function() {
        it('Should serialize form', function() {
                
                var form = {
                    elements: [
                                {name:'Jim' , value:'1'} ,
                                {name:'Bob' , value:'2'} , 
                                {name:'Keren' , value:''} 
                    ]

                }

                expect( serialize(form) ).to.equal("Jim=1&Bob=2&Keren=&"); 

        });
    });

    describe('Check arrangeMsg', function() {
        it('Should arrange message', function() {
                
                var message = {
        
                    name:'Jim' ,
                    text:'Hi!' , 
                    time:'16:00', 
                    mail:'Jim@gmail.com' , 
                    link:'link' 

                }

                expect( arrangeMsg(message) ).to.equal("name=Jim&text=Hi!&time=16%3A00&mail=Jim%40gmail.com&link=link&"); 

        });
    });

    describe('Check functions for changing background', function() {

        var div1,div2,div3;
        
        div1 = document.createElement('div');
        div1.className = "div-elements";
        document.querySelector("body").appendChild(div1);
        
        div1.style.width = "5em";
        div1.style.height = "5em";
        div1.style.backgroundColor = "black";
        div1.style.display = "inline-block";
        div1.style.border = "0.01em dotted blue";

        div2 = document.createElement('div');
        div2.className = "div-elements";
        document.querySelector("body").appendChild(div2);

        div2.style.width = "5em";
        div2.style.height = "5em";
        div2.style.backgroundColor = "black";
        div2.style.display = "inline-block";
        div2.style.border = "0.01em dotted blue";

        div3 = document.createElement('div');
        div3.className = "div-elements";
        document.querySelector("body").appendChild(div3);

        div3.style.width = "5em";
        div3.style.height = "5em";
        div3.style.backgroundColor = "black";
        div3.style.display = "inline-block";
        div3.style.border = "0.01em dotted blue";

        var backgroundArray = document.getElementsByClassName("div-elements");

        it('focusFunc - Should change the background color for middle div', function() {

                var func = focusFunc(backgroundArray,1);
                func();

                expect( backgroundArray[1].style.backgroundColor ).to.equal("rgb(235, 237, 236)"); 

        });

        it('focusOutFunc - Should change background color for left div', function() {

                var func = focusOutFunc(backgroundArray,0);
                func();

                expect( backgroundArray[0].style.backgroundColor ).to.equal("rgb(255, 255, 255)"); 

        });

        it('backgroundHover - Should change background color for right div', function() {

                var func = backgroundHover(backgroundArray,2);
                func();

                expect( backgroundArray[2].style.backgroundColor ).to.equal("rgb(235, 237, 236)"); 

        });

    });


});