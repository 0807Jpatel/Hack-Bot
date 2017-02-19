var AWS = require("aws-sdk");
var fs = require('fs');
AWS.config.loadFromPath('./config.json');


var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing movies into DynamoDB. Please wait.");

// var jan = JSON.parse(fs.readFileSync('api/1.0/2017/01.json', 'utf8'));
var feb = JSON.parse(fs.readFileSync('api/1.0/2017/02.json', 'utf8'));
// var march = JSON.parse(fs.readFileSync('api/1.0/2017/03.json', 'utf8'));
// var april = JSON.parse(fs.readFileSync('api/1.0/2017/04.json', 'utf8'));
// var may = JSON.parse(fs.readFileSync('api/1.0/2017/05.json', 'utf8'));

// getMonth(jan);
getMonth(feb);
// getMonth(march);
// getMonth(april);
// getMonth(may);


function getMonth(input){

for (var key in input){

input[key].forEach(function(month){

    if(month.title==""){
    month.title=" ";
  }
      if(month.url==""){
        month.url=" ";
  }    if(month.startDate==""){
        month.startDate=" ";
  }    if(month.endDate==""){
    month.endDate=" ";
  }    if(month.year==""){
    month.year=" ";
  }    if(month.city==""){
    month.city=" ";
  }    if(month.host==""){
    month.host=" ";
  }    if(month.length==""){
    month.length=" ";
  }    if(month.size==""){
    month.size=" ";
  }    if(month.travel==""){
    month.travel=" ";
  }    if(month.prize==""){
    month.prize=" ";
  }    if(month.highSchoolers==""){
    month.highSchoolers=" ";
  }    if(month.cost==""){
    month.cost=" ";
  }    if(month.facebookURL==""){
    month.facebookURL=" ";
  }    if(month.twitterURL==""){
    month.twitterURL=" ";
  }    if(month.googlePlusURL==""){
    month.googlePlusURL=" ";
  }    if(month.notes==""){
    month.notes=" ";
  }
var params={
  TableName:"Hackathons",

  Item:{
    "title": month.title,
    "link": month.url,
    "startDate": month.startDate,
    "endDate": month.endDate,
    "years": month.year,
    "city": month.city,
    "host": month.host,
    "maxsize": month.size,
    "travel": month.travel,
    "prize": month.prize,
    "highSchoolers": month.highSchoolers,
    "cost": month.cost,
    "facebookURL": month.facebookURL,
    "twitterURL": month.twitterURL,
    "googlePlusURL": month.googlePlusURL,
    "notes": month.notes
  }
};


docClient.put(params, function(err,data){
  if (err){
    console.log(month.title, JSON.stringify(err, null, 2));
  }
  else{
    console.log("good shit");
  }

})
});

}
}