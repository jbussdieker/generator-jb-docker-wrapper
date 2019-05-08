'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the neat ${chalk.red('generator-jb-docker-wrapper')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Project name (should match main provided binary name)',
        default: null,
        required: true
      },
      {
        type: 'input',
        name: 'strategy',
        message: 'Packaging strategy to use (skip to manually setup)',
        default: 'default',
        required: true
      },
      {
        type: 'input',
        name: 'latestVersion',
        message: 'Latest version including prereleases',
        default: '',
        required: true
      },
      {
        type: 'input',
        name: 'stableVersion',
        message: 'LTS or stable version',
        default: '',
        required: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  default() {
    this.composeWith(require.resolve('generator-jb-docker/generators/dockerfile'), {
      sourceImage: 'ubuntu',
      template: this.templatePath(`Dockerfile.${this.props.strategy}`),
      name: this.props.name
    });

    this.composeWith(require.resolve('generator-jb-jenkinsfile/generators/jenkinsfile'), {
      scriptName: 'Jenkinsfile',
      template: this.templatePath('Jenkinsfile'),
      name: this.props.name,
      latestVersion: this.props.latestVersion,
      stableVersion: this.props.stableVersion
    });
  }
};
