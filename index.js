'use strict'

const AWS=require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
AWS.config.loadFromPath('./config.json');

var exec = require('child_process').exec;


const app = express();
//app.sets('port', (process.env.PORT || 5000));
var port = 9000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


let token = "EAAabhSLUXDIBAFubWSmgkRwZCQwNRGXtR8ezZBgAZBZAD6aMAJ0RN7gZCIRwTqvVZCgEI3u4V6Ebm7rj2nfZAij6nlTr5i0WPhKSlj1FZCJKZAQ5z3ZAAHmVUzw52usJu8F9xnwcBawgEVADZCZAznEkE75VkdaI5L3CiEptFwZB4eZBIJRyOt2pYuMxFv";



app.get('/', function(req, res){
    res.send("A bot that helps find hackathon events");
});

app.get('/webhook', function(req, res){
    if(req.query['hub.verify_token'] == "seawolf123"){
        res.send(req.query['hub.challenge']);
    }
    res.send("wrong token");
});

app.post('/webhook', function(req, res){
    let message_events = req.body.entry[0].messaging;
    for(let i = 0; i < message_events.length; i++){
	let event = message_events[i];
        let sender = event.sender.id;
	if(event.message && event.message.text){
		let text = event.message.text;
		if(text == "help"){
			sendText(sender,"");

		}else if(text == "Hackathons in "){

		}else if( text == "Hackathon this months"){

		}else{

		}
	}else{

	}
	
    }
});

function requestWebHook(){

	console.log("entered");
	exec("./webhook.sh", function(err, stdout, stderr){
		console.log(err,stdout,stderr);
	});
	console.log("ASdfasdfasdf");
}
function sendMD(sender, messageData){
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: token},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function(error, response, body){
        if(error){
            console.log("sending error");
        }else if(response.body.error){
            console.log('response body error');
        }
    })
}

function sendText(sender, text){
    let messageData = {text: text};
    sendMD(sender, messageData);
};

app.listen(port);	
requestWebHook();



