# Cordova Documentation Redirect Server

## Redirect Logic

    Request      |  Type  |  Redirect
    -------------|--------|----------------
    /            |  302   |  /en/VERSION/index.html
    /some/path/  |  302   |  /some/path/

## Contribute

### Install

1. Install [Heroku Toolkit](https://toolbelt.heroku.com/)
1. `$ npm install`

### Updating Homepage Version

    $ echo 2.5.0 > VERSION
    $ git commit -am "Default redirect to version 2.5.0"

### Start Server

    $ npm start

### Deploy to Heroku

    # Sanity test that Heroku Procfile works
    $ foreman start

    # Add Heroku remote repository
    $ git remote add heroku git@heroku.com:docs-cordova-io.git

    # Heroku must deploy from master branch
    $ git push heroku docs-cordova-io:master

## Heroku Details

- Project: [docs-cordova-io](https://dashboard.heroku.com/apps/docs-cordova-io/resources)
- Git Repo: [git@heroku.com:docs-cordova-io.git](git@heroku.com:docs-cordova-io.git)
- Owner: Michael Brooks <michael@michaelbrooks.ca>

To become a collaborator to the Heroku project:

- Sign up for a [Heroku account](http://heroku.com)
- Email dev@cordova.apache.org and provide your Heroku account
