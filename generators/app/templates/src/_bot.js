const builder = require('botbuilder');
<%- useCosmosDB %>
<%- useAppInsights %>

// For Console connector
// const connector = new builder.ConsoleConnector().listen();

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
const bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});

// Bot Storage Configuration
<%- useCosmosDBConfig %>

// Azure App Insights Configuration
<%- useInsightsConfig %>

module.exports = bot;
