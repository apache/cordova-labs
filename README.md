Cordova FirefoxOS (Boot 2 Gecko)
==============================

Introduction
------------

Firefox OS is an open source operating system for smartphones and tablet computers being developed by Mozilla. It is designed to allow HTML5 applications to integrate directly with the device's hardware using JavaScript.

cordova-firefoxos allows developers to use the cross platform APIs in Cordova to target the Firefox OS. Most APIs are just proxied to the matching Firefox OS API calls.


Prerequisties:
==============

A lot of good documentation is available on the [Mozilla Developer Network](https://developer.mozilla.org/en/docs/Mozilla/Firefox_OS)

A simulator (runs as a Firefox plugin) is available [here](http://people.mozilla.org/~myk/r2d2b2g/)

The following software is required to package and deploy an app directly to a Firefox OS device:
-[Android SDK](http://developer.android.com/sdk/index.html)
-on Mac you will need to install XCode & Command Line Tools for XCode
-Firefox OS device with OS Version 1.0.0.0 prerelease

Getting Started:
================

1. Bootstrap your computer so to make sure that you have all the prerequisites for building Firefox
- instructions can be found under the "Build prerequisites" section on the following [page](https://developer.mozilla.org/en-US/docs/Simple_Firefox_build)
2. Clone the Firefox repository: git clone git://github.com/mozilla/mozilla-central.git
3. Build Firefox by following the instructions under the "Building" on the following [page](https://developer.mozilla.org/en-US/docs/Simple_Firefox_build)
4. Clone the cordova-firefoxos repository

If Deploying to device:

5. Modify the XPCSHELL constant in the Makefile to point to the location of xpcshell on your computer
6. Modify the ADB constant in the Makefile to point to the location of adb on your computer
7. Make sure the Firefox OS device has remote debugging enabled. To enable remote debugging navigate to the following settings on the device: Settings->Device Information->More Information->Developer->Remote Debugging.
8. Run the Makefile by typing "make" into the command line.
9. The device should prompt you to allow a remote connection, your Apache Cordova Firefox OS app will be installed to the device once you accept the prompt. 

If Deploying to simulator:

7. Open the Firefox OS simulator add-on by going to Tools->Web Developer->Firefox OS Simulator
8. Start the simulator
9. Click on the Add Directory button and then choose the manifest.webapp file in the framework folder of your Apache Cordova app.

