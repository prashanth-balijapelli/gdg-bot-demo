// var restify = require('restify');
// var builder = require('botbuilder');

// var server = restify.createServer();
// server.listen(3798,function(){
// 	console.log('%s listening to %s', server.name,server.url);
// 	});

// var connector = new builder.ChatConnector({
// 	appId: '2ec83f66-8f45-4852-82cf-cf1602225bd9',
// 	appPassword:'1Ujqf1p5129WNHQujUCik62'});

// var bot = new builder.UniversalBot(connector);

// server.post('/api/messages',connector.listen());

// server.get('/home',function(req,res){
// 	res.send("server is running");
// });

// bot.dialog('/',function(session){
// 	res.send("hello world rest api");
// 	//session.send("Hello world");
// });
//testing git 
var restify = require('restify');
var builder = require('botbuilder');

// Create bot and add dialogs
var connector = new builder.ChatConnector({
	appId: '2ec83f66-8f45-4852-82cf-cf1602225bd9',
	appPassword:'1Ujqf1p5129WNHQujUCik62'});

var bot = new builder.UniversalBot(connector);  
// bot.dialog('/', function (session) {
//     session.send('what ever you say this my final answer');
// });
var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

// Setup Restify Server
var server = restify.createServer();

server.post('/api/messages', connector.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});

server.get('/home',function(req,res){
	res.send("server is running test by rest api");
});
