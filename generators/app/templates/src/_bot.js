const builder = require('botbuilder');
require('dotenv').config();
<%- useCosmosDB %>
<%- useAppInsights %>
<%- useQna %>

// For Console connector
// const connector = new builder.ConsoleConnector().listen();

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
const bot = new builder.UniversalBot(connector, function (session) {
    // Remove this function if any of the services(LUIS or QnA etc.,) are used
    session.send("You said: %s", session.message.text);
});

// Bot Storage Configuration
<%- useCosmosDBConfig %>

// Azure App Insights Configuration
<%- useInsightsConfig %>

// QnA Configuration
<%- useQnaConfig %>

// LUIS Configuration
<%- useLUISConfig %>

// Uncomment below code and use accordingly with the selected services

// const intents = new builder.IntentDialog({
// // Remove the other recognizer if only one is seleted
//   recognizers: [luisRecognizer, qnaRecognizer]
// });

// // Setting root route
// bot.dialog('/', intents);

// // For only LUIS or [LUIS and QnA together]
// intent.matches('<LuisIntent>', builder.DialogAction.beginDialog('<IntentDialog>'));
// bot.dialog('<IntentDialog>', [function(session, args){ ... }]);

// // For only QnA or [QnA and LUIS together]
// intent.matches('qna', [ function(session, args) { ...}]);

// // If intent is not matched with any of the Recognizers, it will reach here
// intents.onDefault([
//   function(session, args){
//     session.send(`Sorry I Couldn't find any answer to your question.`);
//   }
// ])

module.exports = bot;
