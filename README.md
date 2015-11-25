This the test server for these Cordova FileTransfer Jasmine tests: 
https://github.com/apache/cordova-mobile-spec/blob/master/autotest/tests/filetransfer.tests.js

It runs on cordova-vm.apache.org. Currently, ask Dmitry Blotsky or Steve Gill to 
do deploy it.

The commands to (re)start the server are:

    forever list
    kill [pid for server.js from above command]
    forever run cordova-labs/server.js

