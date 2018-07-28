'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the funkadelic ${chalk.red('generator-node-msbot')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'botname',
        message: 'Your bot name',
        // Defaults to the project's folder name if the input is skipped
        default: this.appname
      },
      {
        type: 'list',
        name: 'language',
        message: 'Which language you prefer ?',
        choices: ['JavaScript', 'TypeScript']
      },
      {
        type: 'list',
        name: 'botType',
        message: 'Select type of Bot',
        choices: ['Simple', 'Advanced']
      },
      {
        type: 'checkbox',
        name: 'services',
        message: 'Please select the Services you want to use',
        choices: ['QnA Maker', 'LUIS AI'],
        when: props => {
          return props.botType === 'Advanced';
        }
      },
      {
        type: 'confirm',
        name: 'useCosmosDB',
        message: 'Do you like to use CosmosDB storage ?',
        default: false,
        when: props => {
          return props.botType === 'Advanced';
        }
      },
      {
        type: 'confirm',
        name: 'useAppInsights',
        message: 'Do you like to use Azure AppInsights ?',
        default: false,
        when: props => {
          return props.botType === 'Advanced';
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.log(props.botname);
    });
  }

  writing() {
    const fe = this.props.language === 'JavaScript' ? 'js' : 'ts';
    // CosmosDB config
    const useCosmosDB = this.props.useCosmosDB
      ? `const azure = require('botbuilder-azure');`
      : null;

    const cosmosDBConfig = `bot.set('storage', new azure.AzureBotStorage({
      gzipData: false
    }, new azure.DocumenDbClient({
      host: process.env.host,
      masterKey: process.env.masterKey,
      database: process.env.DatabaseName,
      collection: process.env.collection
    })));`;

    const useCosmosDBConfig = this.props.useCosmosDB
      ? cosmosDBConfig
      : `bot.set('storage', new builder.MemoryBotStorage());`;

    // App Insights Config
    const useAppInsights = this.props.useAppInsights
      ? `const insights = require('applicationinsights');`
      : null;
    const insightsConfig = `insights.setup(process.env.appId).start();
    const insightsClient = insights.defaultClient;
    insightsClient.trackDependency({
        dependencyTypeName: "<dependencyName>",
        name: "<commandName>",
        duration: duration,
        success: true
    });`;

    const useInsightsConfig = this.props.useAppInsights ? insightsConfig : null;
    // Copy the configuration files

    this.config = () => {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        { name: this.props.botname }
      );
    };

    // Copy the application files

    this.app = () => {
      this.fs.copy(
        this.templatePath(`src/_app.${fe}`),
        this.destinationPath(`src/app.${fe}`)
      );
      this.fs.copyTpl(
        this.templatePath(`src/_bot.${fe}`),
        this.destinationPath(`src/bot.${fe}`),
        {
          useCosmosDB: useCosmosDB,
          useCosmosDBConfig: useCosmosDBConfig,
          useAppInsights: useAppInsights,
          useInsightsConfig: useInsightsConfig
        }
      );
      this.fs.copy(this.templatePath('_.gitignore'), this.destinationPath('.gitignore'));
      this.fs.copy(
        this.templatePath(`tests/_app.test.${fe}`),
        this.destinationPath(`tests/app.test.${fe}`)
      );
    };

    this.config();
    this.app();
  }

  install() {
    this.installDependencies({
      bower: false
    });
  }
};
