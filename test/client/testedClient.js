
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


/**
 * append profile pic on figure at a chat message 
 * @param {*} figure : tag
 * @param {*} mail  : string
 */
function appendProfileImg(figure,link) {

        var x = document.createElement("IMG");
        if(link.substring(link.length-4, link.length) == '.png'){
                x.setAttribute("src", link); // anonymous picture link
        } else{
                x.setAttribute("src", "https://www.gravatar.com/avatar/" + link + "?s=200"  );
        }
        x.setAttribute("width", "30%");
        x.setAttribute("height", "30%");
        x.setAttribute("alt", "");

        figure.appendChild(x);
}

// adjust chat footer
if( screen.height <= (720) ){
        document.getElementById('js-page-footer').style.height = "8%";
}
else {
        document.getElementById('js-page-footer').style.height = "5%";
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


