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
        type: 'confirm',
        name: 'createAzureBot',
        message: 'Do you want to create Azure related Bot',
        default: false
      },
      {
        type: 'rawlist',
        name: 'services',
        message: 'Select services to work',
        choices: ['QnA Maker', 'LUIS AI', 'AppInsights'],
        when: props => {
          return props.createAzureBot;
        }
      },
      {
        type: 'confirm',
        name: 'useCosmosDB',
        message: 'Do you want to connect with azure Cosmos DB?',
        default: false,
        when: props => {
          return props.createAzureBot;
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
      this.fs.copy(this.templatePath('src/_app.js'), this.destinationPath('src/app.js'));
      this.fs.copy(this.templatePath('_.gitignore'), this.destinationPath('.gitignore'));
      this.fs.copy(
        this.templatePath('tests/_app.test.js'),
        this.destinationPath('tests/app.test.js')
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
