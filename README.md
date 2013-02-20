# Cordova Documentation Redirect Server

## Redirects

    Request        Redirect
    ---------------------------------------
    /            |  /en/VERSION/index.html
    /some/path/  |  /some/path/

## Setup

### DNS

__Name:__ `docs.cordova.io`

__Url:__ `http://mwbrooks.redirect-docs-cordova-io.jit.su`

__Redirect Type:__ 302

### Hosting

__Service:__ [Nodejitsu](http://nodejitsu.com)

__Account:__ mwbrooks (Michael Brooks)

__URL:__ [http://mwbrooks.redirect-docs-cordova-io.jit.su/](http://mwbrooks.redirect-docs-cordova-io.jit.su/)

## Usage

### Deployment

    $ jitsu deploy

### Updating Default Version

    $ echo 2.5.0 > VERSION

    $ git commit -am "Default redirect to version 2.5.0"

    $ jitsu deploy
