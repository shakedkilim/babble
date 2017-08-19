

var Babble = {

    //Data to save all chat logs and methods    
    messages: new Array(),
    users: new Array(),
    userCount: 0,
    //

    // register user
    register: function (userInfo) {

        var usr;
        document.getElementById("js-modal").style.display = "none";

        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            // Store

            //usr = new Util(document.getElementById("js-fname").value,document.getElementById("js-email").value); // create new user
            usr = new Util(userInfo.name, userInfo.email); // create new user

            localStorage.setItem('babble', JSON.stringify(usr));

            requestPoll({

                method: "GET",
                action: "http://localhost:9000/login?username=" + usr.userInfo.name

            });

        } else {
            // Sorry! No Web Storage support..
            console.log('Not defined');
        }

    },
    // get chat messages
    getMessages: function (counter, callback) {

        var res;
        res = httpRequest("GET", "http://localhost:9000/messages?counter=" + counter);
        if (res != "")
            callback(JSON.parse(res));
    },
    // post a new message
    postMessage: function (message, callback) {

        var res;
        res = httpRequest("POST", "http://localhost:9000/messages", message);
        if (res != "")
            callback({ id: String(Babble.idNum++) });

    },

    idNum: 42,
    // delete a chat message
    deleteMessage: function (id, callback) {

        var res;
        res = httpRequest("DELETE", "http://localhost:9000/messages/" + id);
        if (res != "")
            callback(JSON.parse(res));

    },
    // get chat statues - number of users and messages
    getStats: function (callback) {

        var res;
        res = httpRequest("GET", "http://localhost:9000/stats");
        if (res != "")
            callback(JSON.parse(res));
    },

    messages: new Array(),

    users: new Array(),

    userCount: 0


};



/**
 * addMessage
 * Add message to server data 
 * @param {*} message 
 */
function addMessage(message) {

    message.id = Babble.idNum++;
    (Babble.messages).push(message);

    return message.id;
}


/**
 * getMessages
 * Get messages from server data
 * @param {*} counter 
 */
function getMessages(counter) {

    if (counter == 0) {

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
function deleteMessage(id) {

    var flag = false, index = 0;
    for (var i = 0; i < Babble.messages.length; i++) {

        if (Babble.messages[i].id === id) {
            flag = true;
            index = i;
        }

    }

    if (flag) {
        (Babble.messages).splice(index, 1);
    }


}


var messages = {

    /**
 * addMessage
 * Add message to server data 
 * @param {*} message 
 */
    addMessage: function (message) {

        message.id = Babble.idNum++;
        (Babble.messages).push(message);

        return message.id;
    },


    /**
     * getMessages
     * Get messages from server data
     * @param {*} counter 
     */
    getMessages: function (counter) {

        if (counter == 0) {

            Babble.messages = [];
            return Babble.messages;

        }

        return Babble.messages;

    },

    /**
     * deleteMessage
     * Delete requested message by ID
     * @param {*} id 
     */
    deleteMessage: function (id) {

        var flag = false, index = 0;
        for (var i = 0; i < Babble.messages.length; i++) {

            if (Babble.messages[i].id === id) {
                flag = true;
                index = i;
            }

        }

        if (flag) {
            (Babble.messages).splice(index, 1);
        }


    }

};
var http = require('http');
var urlUtil = require('url');
var queryUtil = require('querystring');

var server = http.createServer(function (request, response) {

    var strData, name, index, counter;
    var url = urlUtil.parse(request.url);

    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", 'GET,OPTIONS,POST,DELETE');



    if (request.method === 'GET') {
        var url = urlUtil.parse(request.url);
        var data = queryUtil.parse(url.query);

        if (!url.path) {
            response.writeHead(404);
        } else if ((url.path).includes("login")) { // add new users to the users' list

            name = (url.path).substring((url.path).indexOf('=') + 1, (url.path).length);
            name = name.replace(/%20/g, ' ');
            if (!Babble.users.includes(name)) {
                (Babble.users).push(name);
                Babble.userCount = (Babble.users).length; // update user count
                response.writeHead(200);
            }

        } else if ((url.path).includes("logout")) { // remove user from users' list

            name = (url.path).substring((url.path).indexOf('=') + 1, (url.path).length);
            name = name.replace(/%20/g, ' ');

            if (Babble.users.includes(name)) {

                (Babble.users).splice(Babble.users.indexOf(name), 1);
                Babble.userCount = (Babble.users).length; // update user count
                response.writeHead(200);
            }


        } else if ((url.path).includes("messages")) { // get messages

            if ((parseInt((url.path).substring((url.path).indexOf('=') + 1, (url.path).length)) != (Babble.messages).length) && (url.path).includes("messages?counter=") && !isNaN((url.path).substring((url.path).indexOf('=') + 1, (url.path).length))) {
                response.writeHead(200, { "Content-Type": "application/json" });
                response.end(JSON.stringify(messages.getMessages(Babble.messages.length + 1)));

            } else if ((url.path) === '/messages' || !isNaN((url.path).substring((url.path).lastIndexOf('/') + 1, (url.path).length))) {

                response.writeHead(405);
                response.end();

            } else if (!(url.path).includes("messages?counter=") || isNaN((url.path).substring((url.path).indexOf('=') + 1, (url.path).length))) {

                response.writeHead(400);
                response.end();

            }

        } else if ((url.path) === ("/stats")) { // update user stats

            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ users: Babble.userCount, messages: Babble.messages.length }));
        } else {

            response.writeHead(404);
            response.end();

        }



        response.end();
    } else if (request.method === 'POST') {

        if ((url.path) === ("/messages")) {

            var requestBody = '';
            request.on('data', function (chunk) {
                requestBody += chunk.toString();
            });

            request.on('end', function () {

                data = requestBody;
                var data = JSON.parse(data);

                console.log('we have all the data ', data);

                //get link for profile picture
                if (data.name !== "Annonymous" && data.name !== undefined)
                    data.link = MD5(data.mail);

                if (data.name !== undefined) // add message
                {
                    messages.addMessage(data);
                }

                response.writeHead(200);
                response.end('Thank you');
            });
        } else if ((url.path) === ("/stats")) {

            response.writeHead(405);
            response.end();

        } else if ((url.path) !== ("/messages")) {

            response.writeHead(405);
            response.end();

        } else {

            response.writeHead(404);
            response.end();

        }



    } else if (request.method == 'DELETE') { // delete message

        if ((url.path).includes("/messages")) {

            if ((url.path).includes("/messages/") && !isNaN((url.path).substring((url.path).lastIndexOf('/') + 1, (url.path).length))) {

                index = parseInt((url.path).substring((url.path).lastIndexOf('/') + 1, (url.path).length)); // get message number
                message = Babble.messages[index];
                messages.deleteMessage(message.id);

                response.writeHead(200);
                response.end(JSON.stringify(true));

            } else {
                response.writeHead(405);
                response.end();
            }

        } else if (url.path === "/stats") {

            response.writeHead(405);
            response.end();

        } else {

            response.writeHead(404);
            response.end();

        }

    } else if (request.method === 'OPTIONS') {

        response.writeHead(204);
        response.end();

    } else {

        response.writeHead(405);
        response.end();
    }

});

module.exports = { Babble, addMessage, getMessages, deleteMessage, server };

