Server for Cordova FileTransfer Jasmine tests

https://github.com/apache/cordova-mobile-spec/blob/master/autotest/tests/filetransfer.tests.js

This needs to be published on the cordova-vm.

Currently, ask Dimitry or Steve Gill to do this.

ssh USER@cordova-vm.apache.org

sudo access:
sudo ls
Use: https://reference.apache.org/committer/otp-md5
Challenge: get when you type sudo in vm
password: normal apache password
enter computed string as password on machine when prompted for password

sudo forever list
kill pid for server.js
sudo forever run cordova-labs/server.js
