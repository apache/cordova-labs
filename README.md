Cordova FirefoxOS (Boot 2 Gecko)
==============================

Directory Structure
-------------------

    framework/ ... Any framework (non app specific code)
    javascript/ .. Cordova JavaScript (built from the cordova-js project)
    bin/ ......... Scripts for project creation

Introduction
------------

Firefox OS is an open source operating system for smartphones and tablet computers being developed by Mozilla. It is designed to allow HTML5 applications to integrate directly with the device's hardware using JavaScript.

cordova-b2g allows developers to use the cross platform APIs in Cordova to target the Firefox OS. Most APIs are just proxied to the matching Firefox OS API calls.


Getting Started
===============

A lot of good documentation is available on the [Mozilla Developer Network](https://developer.mozilla.org/en/docs/Mozilla/Firefox_OS)

A simulator (runs as a Firefox plugin) is availble [here](http://people.mozilla.org/~myk/r2d2b2g/)

Installing the cordova-b2g framework
====================================

Cloning the cordova-b2g repository always provides you with the latest (EDGE) version of the Cordova code.  To clone the repository, do the following:

    $ cd ~/some/path
    $ git clone https://github.com/gtanner/cordova-b2g.git

Cordova B2G Developer Tools
---------------------------

The Cordova developer tooling is split between general tooling and project level tooling.  Currently the tooling will only work on OSX or Linux.

### General Commands

    ./bin/create [path appname] ...... creates a sample app with the specified path

#### Running the Example Project

Create the example project and build it to the first device:

    ./bin/create
    cd example
    ./cordova/debug

This will start up a web server on port 8008 and ask you to navigate your
phone or simulator to http://localhost:8008/install.html.  This is really only
needed to install like you would from an app store.

You may also use the simluator and Add the www directory to it (point at the manifest.webapp) in that folder. This will
allow you to refresh the app easier when developing.

#### Creating a new Cordova B2G

    ./bin/create ~/Desktop/myapp MyApp

### Project Commands

These commands live in a generated Cordova B2G project. 

    ./cordova/run ............................ install to a connected device or simulator
    ./cordova/build .......................... build project, but do not deploy to simulator or device

There is currently no way to automate installing to the simulator or device so
we are currently just hosting an install.html file on the webserver hosting the app
that you can point your device/simulator to and install the app.  Once more commandline
tools become available this will probably change.
