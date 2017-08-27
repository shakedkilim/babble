'use strict';


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

function footerAdjust(o) {
        var h = document.getElementById('js-textArea').style.height;
        var formHeight = document.getElementById('js-form-footer').style.height;
        if( ( isNaN(Number(formHeight.substring(0,3))) ) || ( Number(formHeight.substring(0,3)) < 300 ) )  {
                o.style.height = h;
        } else {
                o.style.height = "300px";
        }
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

/* get form from html */

        console.log('hello from client');

        
       
        /**
         * Send message to the server data on submit
         */
        document.querySelector('form').addEventListener('submit', function(e) {
                e.preventDefault();
                var textArea = document.getElementById('js-textArea');
                var form = document.getElementById('js-form-footer');
                var footer = document.getElementById('js-page-footer');
                var usr;
                var counter;
                var d,h,m;
                var form = document.querySelector('form');

                if (typeof(Storage) !== "undefined") {
                                // Code for localStorage/sessionStorage.
                                // Store
                                usr = JSON.parse(localStorage.getItem('babble'));  // get user info

                } else {
                                // Sorry! No Web Storage support..
                                console.log('Not defined');
                }
                

                // Unix time
                const dateTime = Date.now();
                const timestamp = Math.floor(dateTime / 1000);
                
                var msg = new Message(usr.userInfo.name,serialize(form).substring(8,serialize(form).lastIndexOf("&")),(timestamp),usr.userInfo.email,'',Babble.idNum);
                textArea.style.height="";
                form.style.height="";
                if( screen.height <= (720) ){
                        footer.style.height = "8%";
                }
                else {
                        footer.style.height = "5%";       
                }
                                

                Babble.postMessage(msg,function(result){

                        textArea.value='';

                });

                
        });

        /**
         * timeConverter
         * Convert from unix time to regular time.
         * @param {*} UNIX_timestamp 
         */
        function timeConverter(UNIX_timestamp){
                var a = new Date(UNIX_timestamp * 1000);
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                var year = a.getFullYear();
                var month = months[a.getMonth()];
                var date = a.getDate();
                var hour = a.getHours();
                var min = a.getMinutes();
                var sec = a.getSeconds();
                //(h+':'+(m<10?('0'+m):(m)))
                var time = (hour+':'+(min<10?('0'+min):(min)));
                return time;
        }


        // check for messages
        function poll(action) {

                var usr,usrCount,msgCount,result;
                var counter, Babble = window.Babble;
                var list = document.getElementById('js-chat-list');
                action =  action === undefined ? '' : action; // remove 'undefined' from sending data
                var form = document.querySelector('form');
                
                if (typeof(Storage) !== "undefined") {
                                // Code for localStorage/sessionStorage.
                                // Store
                                usr = JSON.parse(localStorage.getItem('babble'));

                } else {
                                // Sorry! No Web Storage support..
                                console.log('Not defined');
                }

                if(!usr){
                        
                        return;
                }
                
                counter = list.childElementCount; // number of messages 
                usrCount = parseInt(document.getElementById('js-usr-count').innerHTML);
                msgCount = parseInt(document.getElementById('js-msg-count').innerHTML);
                
               
                Babble.getMessages( msgCount , function(result){

                        
                        if( result !== "" && result !== 'Thank you' && localStorage.length !== 0){

                                if (typeof(Storage) !== "undefined") {
                                        // Code for localStorage/sessionStorage.
                                        // Store
                                        
                                        usr = new Util((usr.userInfo).name,(usr.userInfo).email,usr.currentMessage); // create new user
                                        
                                        localStorage.setItem('babble', JSON.stringify(usr) );

                                } else {
                                        // Sorry! No Web Storage support..
                                        console.log('Not defined');
                                }
                                //console.log(result);
                                updateChat(result);
                                
                        }

                });
                        

                Babble.getStats(function(result){

                        if(result !== undefined )
                        {

                                document.getElementById('js-usr-count').innerHTML = 0;
                               
                                if(result != "Thank you" && result != undefined){
                                        //result = JSON.parse(result);
                                        document.getElementById('js-usr-count').innerHTML = result.users;
                                        document.getElementById('js-msg-count').innerHTML = result.messages;
                                } else{
                                        document.getElementById('js-usr-count').innerHTML = usrCount;
                                }
                        }

                });

                requestPoll({
                        
                        method: "GET",
                        action: "http://localhost:9000/login?username="+usr.userInfo.name

                });




        };
        setInterval(poll,1000); // poll once in a second

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
         * request
         * Arrange request for submitting message to server
         * @param {*} props 
         */
        function request(props) {
                return new Promise(function(resolve, reject) {
                        var obj;
                        var xhr = new XMLHttpRequest();
                        xhr.open(props.method, props.action);
                        if (props.method === 'POST') {
                                xhr.setRequestHeader('Content-Type', 'application/json');
                        }
                        xhr.addEventListener('load', function(e) {
                                resolve(e.target.responseText);
                        });
                        xhr.onreadystatechange = function () {
                                if( xhr.readyState === 4 && xhr.status === 200 ) {
                                        obj = JSON.parse(xhr.responseText);
                                        console.log(obj);
                                }
                        };
                        xhr.send(props.data);

                });
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
         * updateChat
         * update messages on the chat
         */
        function updateChat(babble){

                var textArea = document.getElementById('js-textArea');// clear textarea
                //textArea.value='';
                //console.log('extracted');

                if(babble !== 'Thank you' )
                {
                        appendChat(babble); // append messages
                }
                
        }
        
        /**
         * message
         * Message constructor
         * @param {*} name 
         * @param {*} text 
         * @param {*} time 
         * @param {*} mail 
         * @param {*} link - link to photo
         */
        function Message(name,text,time,mail,link,id){

            this.name = name;
            this.text = text;
            this.time = time;
            this.mail = mail;
            this.link = link || 'images/anonymous.png' //'https://pbs.twimg.com/profile_images/453956388851445761/8BKnRUXg.png';
            this.id = id;
               
        }

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

                var text,time;
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

                
                //document.getElementById('js-msg-count').innerHTML = '';
                document.getElementById('js-msg-count').innerHTML = (babble).length; // update message counter in display

                // create elements for each message in data object from server
                for(var i=0; i < (babble).length ; i++)
                {
                      
                      entry = document.createElement('li');
                      entry.className = "li-message";

                      wrap = document.createElement('div');
                      wrap.tabIndex = tab++; // for tab key

                      figure = document.createElement('figure');

                      article = document.createElement('article');
                      
                      wrap1 = document.createElement('header');
                      wrap2 = document.createElement('article');

                      appendProfileImg(figure,(babble)[i].link); // photo link

                      entry.appendChild(figure);
                      entry.appendChild(article);

                      para1 = document.createElement("cite");
                      para2 = document.createElement("strong");


                      para2.appendChild(document.createTextNode((babble)[i].name)); // name
                      para1.appendChild(para2);
                      wrap1.appendChild(para1);
                      
                      time = timeConverter((babble)[i].time); // convert from UNIX time

                      para2 = document.createElement("time");
                      para2.appendChild(document.createTextNode(time)); // message time
                      wrap1.appendChild(para2);

                      close = document.createElement("button"); // close button
                      close.setAttribute("aria-label","Close message");

                      x = document.createElement("img");
                      
                      x.setAttribute("src", "images/close.gif" );
                      x.setAttribute("align", "right" );
                
                      close.appendChild(x);
                      wrap1.appendChild(close);
                      close.tabIndex = tab++;
                      close.className = "close-message"; 
                      close.setAttribute("aria-label","Delete message")

                      para3 = document.createElement("p");
                      wrap1.appendChild(para3);

                      text = (babble)[i].text; // message text

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
         * deleteMessage
         * Delete the requested message
         * @param {*} liArray : li array
         * @param {*} i : index
         */
        function deleteMessage(liArray,i){

                var usr,name;

                if(localStorage.length == 1){

                        usr = localStorage.getItem('babble', JSON.stringify(usr) );
                        usr = JSON.parse(usr);
                        name = usr.userInfo.name;
                }
                else{

                        // Do nothing
                        console.log('Local storage is empty');
                }

                return function(){
                       // check weather the messeage belongs to the user
                        if( liArray[i]!==undefined && liArray[i].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerHTML == name ){
                                
                                Babble.deleteMessage(i,function(result){

                                        document.getElementById('js-msg-count').innerHTML = liArray.length;

                                });

                                
                        }
                }
        }

        /**
         * Event litsener when window opens
         */
        window.addEventListener("load", function(e) {

                var usr;
                var textArea;
                
                if (typeof(Storage) !== "undefined") {
                                // Code for localStorage/sessionStorage.
                                // Store

                                if(localStorage.length == 0){
                                        document.getElementById("js-modal").style.display = "block";
                                        document.getElementsByClassName("Modal-overlay")[0].style.display = "block";
                                }
                                else{

                                        usr = localStorage.getItem('babble' );
                                        usr = JSON.parse(usr);

                                        if( usr.userInfo.currentMessage != '' )
                                        {
                                                textArea = document.getElementById('js-textArea');
                                                textArea.value = usr.currentMessage; // restore message textarea
                                        }

                                        
                                }

                } else {
                                // Sorry! No Web Storage support..
                                console.log('Not defined');
                }
                
        });

        /**
         * Event listener when window closes
         */
        window.addEventListener("unload", function(e) {

                var usr;
                var textArea;

                if (typeof(Storage) !== "undefined") {
                                // Code for localStorage/sessionStorage.
                                // Store

                                textArea = document.getElementById('js-textArea');

                                if(localStorage.length == 1){

                                        usr = localStorage.getItem('babble');
                                        usr = JSON.parse(usr);
                                        usr.currentMessage = textArea.value; // save user's unsent message in local storage
                                        localStorage.setItem('babble', JSON.stringify(usr) ); // save user's details in local storage

                                        requestPoll({
                        
                                                method: "GET",
                                                action: "http://localhost:9000/logout?username="+usr.userInfo.name

                                        }); 

                                }
                                else{

                                        // Do nothing
                                        console.log('Local storage is empty');
                
                                }

                } else {
                                // Sorry! No Web Storage support..
                                console.log('Not defined');
                }

                

        });

                /**
                 * Event listener when user discards popup modal and continues as annonymous
                 */
                document.getElementById("js-modal-close").addEventListener("click", function(){
                

                var usr;
                document.getElementById("js-modal").style.display = "none";
                document.getElementsByClassName("Modal-overlay")[0].style.display = "none";        

                if (typeof(Storage) !== "undefined") {
                        // Code for localStorage/sessionStorage.
                        // Store

                        usr = new Util('Annonymous'); // create Annonymous username
                        
                        localStorage.setItem('babble', JSON.stringify(usr) );

                } else {
                                // Sorry! No Web Storage support..
                                console.log('Not defined');
                }

                requestPoll({
                        
                                method: "GET",
                                action: "http://localhost:9000/login?username="+usr.userInfo.name

                });// increase the counter - for plus



        });
        
        window.Babble = {
                
            //Data to save all chat logs and methods    
            messages: new Array() ,
            users: new Array(),
            userCount:0,
            //

            // register user
            register: function(userInfo){

                var usr;
                document.getElementById("js-modal").style.display = "none";
                document.getElementsByClassName("Modal-overlay")[0].style.display = "none";

                if (typeof(Storage) !== "undefined") {
                        // Code for localStorage/sessionStorage.
                        // Store

                        //usr = new Util(document.getElementById("js-fname").value,document.getElementById("js-email").value); // create new user
                        usr = new Util(userInfo.name,userInfo.email); // create new user

                        localStorage.setItem('babble', JSON.stringify(usr) );
                        
                        requestPoll({
                        
                                method: "GET",
                                action: "http://localhost:9000/login?username="+usr.userInfo.name

                        });

                } else {
                                // Sorry! No Web Storage support..
                                console.log('Not defined');
                }

            },
            // get chat messages
            getMessages: function(counter, callback){

                var res;
                res = httpRequest("GET","http://localhost:9000/messages?counter="+counter);
                if(res!="")
                        callback( JSON.parse(res) );                      
            },
            // post a new message
            postMessage: function(message , callback){

                var res;
                res = httpRequest("POST","http://localhost:9000/messages",message);
                if(res!="")
                        callback( {id: String(Babble.idNum)} );
                
            },

            idNum: 42,
            //delete a chat message
            deleteMessage: function(id, callback){

                var res;
                res = httpRequest("DELETE","http://localhost:9000/messages/"+id);
                if(res!="")
                        callback(JSON.parse(res));

            },
            // get chat statues - number of users and messages
            getStats: function(callback){

                var res;
                res = httpRequest("GET","http://localhost:9000/stats");
                if(res!="")
                        callback(JSON.parse(res));
            },

            messages: new Array() ,

            users: new Array(),

            userCount:0

                
        }

        function httpRequest(method,theUrl,data)
        {
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open( method, theUrl, false ); // false for synchronous request
                xmlHttp.send(JSON.stringify(data));
                return xmlHttp.responseText;
        }


        /**
         * Event listener when user logs in 
         * Collects and saves user's details 
         */
        document.getElementById("js-modal-login").addEventListener("click", function(){
                
                var Babble = window.Babble;
                var userInfo = { name: document.getElementById("js-fname").value , email: document.getElementById("js-email").value };
                Babble.register(userInfo);
                
        });



        
