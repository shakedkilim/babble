
'use strict';

// client testing:
localStorage.setItem("babble",JSON.stringify(new Util("",""))); 

window.Babble = {
            
            register: function(userInfo){

                var usr;
                document.getElementById("js-modal").style.display = "none";

                if (typeof(Storage) !== "undefined") {
                        // Code for localStorage/sessionStorage.
                        // Store

                        usr = new Util(userInfo.name,userInfo.email); // create new user

                        localStorage.setItem('babble', JSON.stringify(usr) );
                        
                        requestPoll({
                                
                                method: "GET",
                                action: "http://localhost:9090/login?username="+usr.userInfo.name

                        });

                } else {
                                // Sorry! No Web Storage support..
                                console.log('Not defined');
                }

            },
            
            getMessages: function(counter, callback){

                var res;
                res = httpRequest("GET","http://localhost:9090/messages?counter="+counter);
                if(res!="")
                        callback( JSON.parse(res) );                      
            },

            postMessage: function(message , callback){

                var res;
                res = httpRequest("POST","http://localhost:9090/messages",message);
                if(res!="")
                        callback( {id: String(Babble.idNum++)} );
                
            },

            idNum: 42,

            deleteMessage: function(id, callback){

                var res;
                res = httpRequest("DELETE","http://localhost:9090/messages/"+id);
                if(res!="")
                        callback(JSON.parse(res));

            },

            getStats: function(callback){

                var res;
                res = httpRequest("GET","http://localhost:9090/stats");
                if(res!="")
                        callback(JSON.parse(res));
            }
            
                
}

function httpRequest(method,theUrl,data)
{
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( method, theUrl, false ); // false for synchronous request
        xmlHttp.send(JSON.stringify(data));
        return xmlHttp.responseText;
}

// window.sinon = "require('')";

/**
 * Util
 * Babble user constructor
 * @param {*} name
 * @param {*} mail 
 */
function Util(name,mail,currentMessage){
        
        this.currentMessage = currentMessage || '';
        this.userInfo = { name: name , email:mail };
        
}



/**
 * requestPoll
 * Long pulling request with timeout( timeout is for pending requests )
 * @param {*} props 
 */
function requestPoll(props) {
        return new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open(props.method, props.action);
                xhr.timeout = 500; // time in milliseconds
                if (props.method === 'post' ) {
                        xhr.setRequestHeader('Content-Type', 'application/json');
                }
                xhr.addEventListener('load', function(e) {
                        resolve(e.target.responseText);
                });

                xhr.send(JSON.stringify(props.data));

        });
        
}

// window.Babble = new Util("Shaked Kilim","Shakedkiim@gmail.com");

// window.Babble.register( { name: "Shaked Kilim" , mail: "Shakedkiim@gmail.com" } );


























/**
 * append profile pic on figure at a chat message 
 * @param {*} figure : tag
 * @param {*} mail  : string
 */
function appendProfileImg(figure,link) {

        var x = document.createElement("IMG");
        if(link.substring(link.length-4, link.length) == 'png'){
                x.setAttribute("src", link); // anonymous picture link
        } else{
                x.setAttribute("src", "https://www.gravatar.com/avatar/" + link + "?s=200"  );
        }
        x.setAttribute("width", "30%");
        x.setAttribute("height", "30%");
        x.setAttribute("alt", "");

        figure.appendChild(x);
}

// functions for adjusting textarea
 
function resizeTextarea (id) {
        var a = document.getElementById(id);
        a.style.height = a.scrollHeight+'px';
        
}

function formAdjust(o) {
        var h = document.getElementById('js-textArea').style.height;
        var formHeight = document.getElementById('js-form-footer').style.height;
        if( ( isNaN(Number(formHeight.substring(0,3))) ) || ( Number(formHeight.substring(0,3)) < 300 ) ){
                o.style.height = h;
        } else {
                o.style.height = "300px";
        } 
}

function footerAdjust(o) {
        var h = document.getElementById('js-textArea').style.height;
        var formHeight = document.getElementById('js-form-footer').style.height;
        if( ( isNaN(Number(formHeight.substring(0,3))) ) || ( Number(formHeight.substring(0,3)) < 300 ) )  {
                o.style.height = h;
        } else {
                o.style.height = "300px";
        }
}


/**
 * serialize
 * Arrange message sent via submit button
 * @param {*} form 
 */
function serialize(form) {
        var data = '';
        for (var i = 0; i < form.elements.length; i++) {
                var element = form.elements[i];
                if (element.name) {
                        data += element.name + '=' + encodeURIComponent(element.value) + '&';
                }
        }
        return data;
}


/**
 * arrangeMsg
 * Arrange message displayed in the chat 
 * @param {*} msg 
 */
function arrangeMsg(msg) {
        var data = '';
        for (var key in msg) {
                var element = msg[key];
                if (msg[key]) {
                        data += key + '=' + encodeURIComponent(msg[key]) + '&';
                }
        }
        return data;
}

/**
 * focusFunc
 * Get element in array and change its backround
 * @param {*} backgroundArray : div array 
 * @param {*} i : index 
 */
function focusFunc(backgroundArray,i){
        return function(){
                
                backgroundArray[i].style.backgroundColor = "rgb(235,237,236)";
                
        }
}

/**
 * focusOutFunc
 * Get element in array and change its backround
 * @param {*} backgroundArray : div array 
 * @param {*} i : index 
 */
function focusOutFunc(backgroundArray,i){
        return function(){
                        
                backgroundArray[i].style.backgroundColor = "rgb(255, 255, 255)";

        }
}

/**
 * backgroundHover
 * Get element in array and change its backround
 * @param {*} backgroundArray : div array 
 * @param {*} i : index
 */
function backgroundHover(backgroundArray,i){
        return function(){
                        
                backgroundArray[i].style.backgroundColor = "rgb(235,237,236)";

        }
}

/**
 * appendChat
 * Create messages in display
 * Receives data object from server
 */
function appendChat(babble){

        var chat = document.getElementById('js-chat-list');
        var entry;
        var figure;
        var usr;
        var x,close;
        var tab = 1;
        var background;

        var closeArray,backgroundArray,liArray;

        var text;
        var article;
        var mail;
        var name;
        var wrap;
        var wrap1;
        var wrap2;

        var para1;
        var para2;
        var para3;

        chat.innerHTML=''; // clear chat before updating
        

        babble = JSON.parse(babble);

        document.getElementById('js-msg-count').innerHTML = '';
        document.getElementById('js-msg-count').innerHTML = (babble.messages).length; // update message counter in display

        // create elements for each message in data object from server
        for(var i=0; i < (babble.messages).length ; i++)
        {
                
                entry = document.createElement('li');
                entry.className = "li-message";

                wrap = document.createElement('div');
                wrap.tabIndex = tab++; // for tab key

                figure = document.createElement('figure');

                article = document.createElement('article');
                
                wrap1 = document.createElement('header');
                wrap2 = document.createElement('article');

                appendProfileImg(figure,(babble.messages)[i].link); // photo link

                entry.appendChild(figure);
                entry.appendChild(article);

                para1 = document.createElement("cite");
                para2 = document.createElement("strong");
                
                para2.appendChild(document.createTextNode((babble.messages)[i].name)); // name
                para1.appendChild(para2);
                wrap1.appendChild(para1);
                


                para2 = document.createElement("time");
                para2.appendChild(document.createTextNode((babble.messages)[i].time)); // message time
                wrap1.appendChild(para2);

                close = document.createElement("button"); // close button
                close.setAttribute("aria-label","Close message");

                x = document.createElement("img");
                //x.setAttribute("src", "client/images/close.gif" );
                x.setAttribute("align", "right" );
        
                close.appendChild(x);
                wrap1.appendChild(close);
                close.tabIndex = tab++;
                close.className = "close-message"; 

                para3 = document.createElement("p");
                wrap1.appendChild(para3);

                text = (babble.messages)[i].text; // message text

                // handle punctuation marks
                if( text != '' && text != undefined ){
                text = text.replace(/%0A/g, '');
                text = text.replace(/%60/g, '`');
                text = text.replace(/%2C/g, ',');
                text = text.replace(/%2F/g, '/');
                text = text.replace(/%20/g, ' ');
                text = text.replace(/%3F/g, '?');
                }
                para3.appendChild(document.createTextNode(text));
                wrap2.appendChild(para3);

                wrap.appendChild(wrap1);
                wrap.appendChild(wrap2);
                wrap.className = "chat-message";

                article.appendChild(wrap);

                chat.appendChild(entry);

        }

        
        closeArray = document.getElementsByClassName("close-message");
        backgroundArray = document.getElementsByClassName("chat-message");
        liArray = document.getElementsByClassName("li-message");
        setFocusListeners(closeArray, backgroundArray , liArray);
}



/**
 * setFocusListeners
 * set focus listeners for closing and messages and tabbing between messages( in addtion to css rules )
 * @param {*} closeArray : div array 
 * @param {*} backgroundArray : div array 
 * @param {*} liArray : li array
 */
function setFocusListeners(closeArray, backgroundArray, liArray){
        for (var i=0; i< closeArray.length; i++){

                closeArray[i].addEventListener("focus",focusFunc(backgroundArray,i));
                backgroundArray[i].addEventListener("focus", focusFunc(backgroundArray,i) );
                backgroundArray[i].addEventListener("mouseover", backgroundHover(backgroundArray,i) );
                backgroundArray[i].addEventListener("mouseout", focusOutFunc(backgroundArray,i) );
                closeArray[i].addEventListener("focusout",focusOutFunc(backgroundArray,i));
                closeArray[i].addEventListener("click", deleteMessage(liArray,i) );

        }
}


/**
 * deleteMessage 
 * Just for testing
 */
function deleteMessage(liArray,i){

        // Just for testing
}


