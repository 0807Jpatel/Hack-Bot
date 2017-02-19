'use strict'

const AWS=require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
AWS.config.loadFromPath('./config.json');

var exec = require('child_process').exec;
var docClient = new AWS.DynamoDB.DocumentClient();

const app = express();
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


let token = "EAAabhSLUXDIBAFubWSmgkRwZCQwNRGXtR8ezZBgAZBZAD6aMAJ0RN7gZCIRwTqvVZCgEI3u4V6Ebm7rj2nfZAij6nlTr5i0WPhKSlj1FZCJKZAQ5z3ZAAHmVUzw52usJu8F9xnwcBawgEVADZCZAznEkE75VkdaI5L3CiEptFwZB4eZBIJRyOt2pYuMxFv";


app.get('/', function(req, res){
    res.send("A bot that helps find hackathon events");
});

app.get('/webhook/', function(req, res){
    if(req.query['hub.verify_token'] == "seawolf123"){
        res.send(req.query['hub.challenge']);
    }
    res.send("Wrong Token");
});

app.post('/webhook/', function(req, res){
    let message_events = req.body.entry[0].messaging;
    for(let i = 0; i < message_events.length; i++){
        let event = message_events[i];
        let sender = event.sender.id;
        if(event.message && event.message.text){
		let text = event.message.text;
            text = text.toLowerCase();
            if(text == "help"){
                // sendText(sender, "hello");
                sendHelpList(sender);
            }else if(text == "Hackathons in "){
                getUpcomingHackathons(sender);

            }else if( text == "upcoming hack"){

            }else{

            }
	    }else if(event.postback){
            let text = JSON.stringify(event.postback.payload);
            console.log(text);
            if(text == "\"HackMonth\""){
                console.log("LMAO");
                sendText(sender, "Here are your hacks for upcoming month");
            }else if(text == "\"UpcomingHack\""){
                sendText(sender, "Here are upcoming Hacks");
            }
        }
    }
    res.sendStatus(200);
});
function getUpcomingHackathons(sender){

var params = {
    TableName: 'Hackathons',
    ProjectionExpression: "years, title",
    // Key:{
    //     "title": title
    // }
};



docClient.scan(params, function (err, data){

 if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        data.Items.forEach(function(hackathon) {
            var description=hackathon.title+" is located in "+hackathon.city+". This hackathon starts "
            +"on "+hackathon.startDate+" and ends on "+hackathon.endDate;
           // console.log(hackathon.title + " is in " + hackathon.years);
           let messagedata={
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements":[
                            {
                            "title":hackathon.title,
                            "image_url":hackathon.url,
                            "subtitle":description,
                            "default_action": {
                                "type": "web_url",
                                "url": hackathon.url,
                                "messenger_extensions": true,
                                "webview_height_ratio": "tall",
                                "fallback_url": hackathon.facebookURL
                                },
                            "buttons":[
                            { 
                                "type":"web_url",
                                "url":hackathon.url,
                                "title":"View Their Website"
                            }           
                        ]      
                    }
                ]
            }
        }
    }
});
        
        sendMD(sender, messagedata);



        }

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    });


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
            console.log(response.body.error);
            console.log('response body error');
        }
    })
}

app.get('/updatedata', function(req, res){
    requestWebHook();
});

function requestWebHook(){
    exec("./webhook.sh", function(err, stdout, stderr){
        console.log(err,stdout,stderr);
    });
    console.log("updatedata");
}

function sendHelpList(sender){
    let messageData =  {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "list",
            "top_element_style": "compact",
            "elements": [
                {
                    "title": "Hackathon this month",
                    "subtitle": "send: 'Hack this month'",
                    "buttons": [
                        {
                            "title": 'Hack Month',
                            "type": "postback",
                            "payload": "HackMonth"
                        }
                    ]                
                },
                {
                    "title": "Upcoming Hackathon",
                    "subtitle": "send: 'Upcoming Hacks'",
                    "buttons": [
                        {
                            "title": "Upcoming Hacks",
                            "type": "postback",
                            "payload": "UpcomingHack"
                        }
                    ]                
                },
                {
                    "title": "Info about Hackathon",
                    "subtitle": "info HackathonName",             
                }
            ]
        }
    }
    }
    sendMD(sender, messageData);
}




function sendText(sender, text){
    let messageData = {text: text};
    sendMD(sender, messageData);
};

app.listen(app.get('port'), function(){
    console.log("running Port");
});
