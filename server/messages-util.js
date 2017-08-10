

window.Babble = {
                
            //Data to save all chat logs and methods    
            messages: new Array() ,
            users: new Array(),
            userCount:0,
            //

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

            getMessages: function(counter, callback){

                var res;
                res = httpRequest("GET","http://localhost:9000/messages?counter="+counter);
                if(res!="")
                        callback( JSON.parse(res) );                      
            },

            postMessage: function(message , callback){

                var res;
                res = httpRequest("POST","http://localhost:9000/messages",message);
                if(res!="")
                        callback( {id: String(Babble.idNum++)} );
                
            },

            idNum: 42,

            deleteMessage: function(id, callback){

                var res;
                res = httpRequest("DELETE","http://localhost:9000/messages/"+id);
                if(res!="")
                        callback(JSON.parse(res));

            },

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


var messages = {

    addMessage: function(message){



    }

}



