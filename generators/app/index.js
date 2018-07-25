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
      this.fs.copy(this.templatePath('_app.js'), this.destinationPath('app.js'));
    };

    this.config();
    this.app();
  }

  install() {
    // This.installDependencies();
  }
};
