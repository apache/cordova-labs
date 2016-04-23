Description
===========

This the test server for these Cordova FileTransfer Jasmine tests: https://github.com/apache/cordova-plugin-file-transfer/blob/master/tests/tests.js. It runs on cordova-vm.apache.org. Ask Dmitry Blotsky or Richard Knoll to deploy it.

Running
=======

Control the server with the following commands (possibly requiring `sudo`):

    service filetserver start
    service filetserver stop
    service filetserver start
    service filetserver restart

Updating
========

Update the server's code with the following commands (possibly requiring `sudo -u filetransfer`):

    cd /usr/local/filetransfer/cordova-labs
    git pull
    cd ..
    npm install

For the changes to take effect, restart the server.

Reference
=========

The server is run from an `init.d` script. For more information about `init.d`, see the [Wikipedia page][1] and the [reference][2].

[1]: https://en.wikipedia.org/wiki/Init
[2]: http://www.tldp.org/HOWTO/HighQuality-Apps-HOWTO/boot.html
