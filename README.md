# Cordova Issues Redirect Server

> http://issues.cordova.io

## Redirect Logic

    Request      |  Type  |  Redirect
    -------------|--------|----------------
    /            |  302   |  https://issues.apache.org/jira/browse/CB
    /CB-7289     |  302   |  https://issues.apache.org/jira/browse/CB-7289

## Contribute

### Install

1. Install [Heroku Toolkit](https://toolbelt.heroku.com/)
1. `$ npm install`

### Start Server

    $ npm start

### Deploy to Heroku

    # Sanity test that Heroku Procfile works
    $ foreman start

    # Add Heroku remote repository
    $ git remote add heroku git@heroku.com:issues-cordova-io.git

    # Heroku must deploy to master branch
    $ git push heroku issues-cordova-io:master

## Heroku Details

- Project: [issues-cordova-io](https://dashboard.heroku.com/apps/issues-cordova-io/resources)
- Git Repo: [git@heroku.com:issues-cordova-io.git](git@heroku.com:issues-cordova-io.git)
- Owner: Michael Brooks <michael@michaelbrooks.ca>

To become a collaborator to the Heroku project:

- Sign up for a [Heroku account](http://heroku.com)
- Email dev@cordova.apache.org and provide your Heroku account
