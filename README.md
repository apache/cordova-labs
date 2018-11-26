# Cordova Plugin File-Transfer Test Server

This the test server for the [Cordova Plugin File-Transfer's Jasmine tests](https://github.com/apache/cordova-plugin-file-transfer/blob/master/tests/tests.js). 

It is used on the CI server that is running those tests, a current deployment of the server [is configured there as a parameter](https://github.com/apache/cordova-plugin-file-transfer/blob/master/.travis.yml#L69-L71) (http://sheltered-retreat-43956.herokuapp.com at the time of writing).
    
## Installation

```shell
git clone https://github.com/apache/cordova-labs.git
cd cordova-labs
git checkout cordova-filetransfer
```
 
## Usage

### Running manually

```shell
node server.js
```

### Configuring the File-Transfer plugin tests

Set the [`FILETRANSFER_SERVER_ADDRESS` variable](https://github.com/apache/cordova-plugin-file-transfer/blob/9b322dec6790f6d273b8f707bc07976d778c4cf6/tests/plugin.xml#L33) when installing the plugin tests so they use your local service:

```shell
cordova plugin rm cordova-plugin-file-transfer-tests
cordova plugin add path/to/cordova-plugin-file-transfer/tests --variable FILETRANSFER_SERVER_ADDRESS="http://yourlocal-IPAddressHere:5000"
```

- Get your local IP by running:

    ```shell
    ifconfig # Linux, macOS
    ipconfig # Windows
    ```    
    
### Running on a server / as a service

If your hosting provider supports [Procfiles](https://devcenter.heroku.com/articles/procfile), you don't need to do anything as this project contains one.

Another more manual option is using `forever`:

```
# install
npm install -g forever

# start
forever start server.js

# restart
forever restart server.js

# stop
forever start server.js
```
