# Cordova Slackin

> http://slack.cordova.io

## Deploy

### Install

1. Install [Heroku Toolkit](https://toolbelt.heroku.com/)
1. `$ npm install`

### Deploy to Heroku

    # Run and test the server locally (you will need to use the proper ENV variables - see Heroku)
    $ foreman start

    # Add Heroku remote repository
    $ git remote add heroku-slack git@heroku.com:slack-cordova-io.git

    # Heroku must deploy to master branch
    $ git push heroku-slack slack-cordova-io:master

## Heroku Details

- Project: [slack-cordova-io](https://dashboard.heroku.com/apps/slack-cordova-io/resources)
- Git Repo: [git@heroku.com:slack-cordova-io.git](git@heroku.com:slack-cordova-io.git)
- Owner: Michael Brooks <michael@michaelbrooks.ca>

To become a collaborator to the Heroku project:

- Sign up for a [Heroku account](http://heroku.com)
- Email dev@cordova.apache.org and provide your Heroku account

Where are the environment variables?

- The account token and other environment variables are stored in Heroku
- Log into Heroku to reveal the environment variables
