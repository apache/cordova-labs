# cordova-jira

> create issues + subtasks in JIRA when cordova changes versions

## Prerequisites

You will need [node.js](http://nodejs.org), and `npm` which comes bundled with it.

## Installation

    npm install

## Usage

    ./node jira.js --version=<version> --username=<username> --password=<password> [--no_app]

Where:

 - `version`: the version string to use. i.e. 2.3.0, 2.4.0rc1, 3.0.0rc2
 - `username`: your Apache JIRA username
 - `password`: your Apache JIRA password
 - `no_app`: if the Hello World application didn't change since the last release, use this option to omit creating tasks for updating the sample application in each platform implementation.

## Contributors

See the `package.json` file for information.
