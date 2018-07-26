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
        name: 'type',
        message: 'Select type of Bot',
        choices: ['Simple', 'Advanced']
      },
      {
        type: 'checkbox',
        name: 'services',
        message: 'Please select the Services you want to use',
        choices: ['QnA Maker', 'LUIS AI', 'SpeechToText', 'AppInsights'],
        when: props => {
          return props.type === 'Advanced';
        }
      },
      {
        type: 'confirm',
        name: 'useCosmosDB',
        message: 'Do you like to use CosmosDB storage ?',
        default: false,
        when: props => {
          return props.type === 'Advanced';
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
    const extension = this.props.language === 'JavaScript' ? 'js' : 'ts';

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
        this.templatePath(`src/_app.${extension}`),
        this.destinationPath(`src/app.${extension}`)
      );
      this.fs.copy(
        this.templatePath(`src/_bot.${extension}`),
        this.destinationPath(`src/bot.${extension}`)
      );
      this.fs.copy(this.templatePath('_.gitignore'), this.destinationPath('.gitignore'));
      this.fs.copy(
        this.templatePath(`tests/_app.test.${extension}`),
        this.destinationPath(`tests/app.test.${extension}`)
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
