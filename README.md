# cordova-jira

> create issues + subtasks in JIRA. 

## Prerequisites

You will need [node.js](http://nodejs.org), and `npm` which comes bundled with it.

## Installation

    npm install

## Usage

Baseline usage is:

    node jira.js --username=<username> --password=<password>

Where:

 - `username`: your Apache JIRA username
 - `password`: your Apache JIRA password

### Creating Tasks for Tagging a Release

To create an issue for tagging a new release of cordova, use the jira.js script in the following form:

    node jira.js --username=<username> --pasword=<password> --version=<version> [--no_app]

Where:

 - `version`: if specified, will create the issues + subtasks necessary for tagging a new version. this specifies the version string to use. i.e. 2.3.0, 2.4.0rc1, 3.0.0rc2
 - `no_app`: used in conjunction with `version`, if the Hello World application didn't change since the last release, use this option to omit creating tasks for updating the sample application in each platform implementation.

### Create a Top-Level Issue

To create an issue with subtasks for platforms, docs, and tests (for new API additions, cross-platform features, that kind of stuff), use the jira script in the following form:

    node jira.js --username=<username> --pasword=<password> --summary="summary text" --description="description text" [--platforms="<platform>,<platform>"]

Where:

 - `summary`: a summary title for the issue (remember to use quotes so spaces get interpreted properly)
 - `description`: a description for the issue (remember to use quotes so spaces get interpreted properly)
 - `platforms`: a comma-delimited list of applicable platforms. acceptable entries here are (NOTE: case sensitive!):
  - Android
  - iOS
  - OSX
  - BlackBerry
  - WP7
  - WP8
  - Windows8
  - Bada
  - Qt
  - Tizen
  - webOS
  - FireFoxOS

If no `platforms` are specified explicitly, the "core" platforms will be included in an issue (Android, iOS, BlackBerry, Windows Phone 7 + 8, Windows 8, OSX).

## Contributors

See the `package.json` file for information.
