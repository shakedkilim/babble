

'use strict';

var http = require('http');
var urlUtil = require('url');
var queryUtil = require('querystring');

var Babble = { messages: new Array() , users: new Array(),userCount:0 }; // Data object to save all chat logs

var server = http.createServer(function(request, response) {

    var strData,name,index;

    response.setHeader('Access-Control-Allow-Origin', '*');
    

    if (request.method === 'GET') {
        var url = urlUtil.parse(request.url);
        var data = queryUtil.parse(url.query);
        console.log(data.message);
        if (!data.message) {
            response.writeHead(400);
        }
        response.end();
    } else if (request.method === 'POST' ) {
        var requestBody = '';
        request.on('data', function(chunk) {
                requestBody += chunk.toString();
        });
        request.on('end', function() {
            var data = queryUtil.parse(requestBody);
            console.log('we have all the data ', data);

            strData = JSON.stringify(data);

            // Handle different requests
            if( strData.substring(2,5) ==='pol' ){
                
                name = strData.substring( strData.indexOf('/')+1,strData.indexOf('.') );

                if( !Babble.users.includes( strData.substring(strData.indexOf('/')+1,strData.indexOf('.')) ) && name !=='unnamed' && name !=='' && name !== '-' ){ // add new users to the users' list
                        (Babble.users).push( strData.substring(strData.indexOf('/')+1,strData.indexOf('.')) );
                        Babble.userCount = (Babble.users).length; // update user count
                } else if( strData.substring(strData.indexOf('.')+1,strData.indexOf('.')+2) ==='-' && Babble.userCount !== 0 ){ // remove user from users' list
                        (Babble.users).splice( (Babble.users).indexOf( strData.substring(strData.indexOf('/')+1,strData.indexOf('.')) ) , 1 );
                        Babble.userCount = (Babble.users).length;// update user count
                } else if( strData.substring(strData.indexOf('.')+1,strData.indexOf('.')+2) ==='$' ){ // delete message
                        index = parseInt( strData.substring( strData.indexOf('$')+1,strData.length) ); // get message number    
                        (Babble.messages).splice( index ,1);
                }

                // check user and message count and decide weather the request is accepted
                if( ( parseInt(strData.substring(6,strData.indexOf(','))) != (Babble.messages).length ) || ( parseInt(strData.substring(strData.indexOf(',')+1,strData.indexOf('/'))) != Babble.userCount ) ) { 
                    
                    response.end(JSON.stringify(Babble));
                    
                }
                
            }
            else{

                //get link for profile picture
                if(data.name.substring(0,10) !== "Annonymous" && data.name !== undefined )
                        data.link = MD5(data.mail);
                
                if(data.name !== undefined) // add message
                        (Babble.messages).push(data);

            }
            
            response.end('Thank you');
        });
    } else {
        response.writeHead(405);
        response.end();
    }

});


module.exports = {server,Babble};