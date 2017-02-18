'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.sets('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({entended: true}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send("A bot that helps find hackathon events");
});

app.get('/webhook', function(req, res){
    if(req.query['hub.verify_token'] == "seawolf123"){
        res.send(req.query['hub.challenge']);
    }
    res.send{"wrong token");
});

app.post('/webhook', function(req, res){

});




