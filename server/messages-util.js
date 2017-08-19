

var Babble = {
                
            //Data to save all chat logs and methods    
            messages: new Array() ,
            users: new Array(),
            userCount:0,
            //

            // register user
            register: function(userInfo){

                var usr;
                document.getElementById("js-modal").style.display = "none";

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
                        callback( {id: String(Babble.idNum++)} );
                
            },

            idNum: 42,
            // delete a chat message
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

                
};



/**
 * addMessage
 * Add message to server data 
 * @param {*} message 
 */
function addMessage(message){
    
    message.id = Babble.idNum++;
    (Babble.messages).push(message);

    return message.id;
}


/**
 * getMessages
 * Get messages from server data
 * @param {*} counter 
 */
function getMessages(counter){

    if( counter == 0 ){

        Babble.messages = [];
        return Babble.messages;

    } 

    return Babble.messages;

}

/**
 * deleteMessage
 * Delete requested message by ID
 * @param {*} id 
 */
function deleteMessage(id){

    var flag = false , index = 0;
    for( var i = 0; i <  Babble.messages.length ; i++ ){

        if(Babble.messages[i].id === id){
            flag = true;
            index = i;
        } 

    }

    if(flag){
        (Babble.messages).splice( index ,1);
    }
    

}

module.exports = {Babble,addMessage,getMessages,deleteMessage};

