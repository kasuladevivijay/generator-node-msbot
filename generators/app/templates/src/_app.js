const restify = require('restify');
const builder = require('botbuilder');

const bot = require('./bot')

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Listen for messages from users 
server.post('/api/messages', bot.connector('*').listen());
