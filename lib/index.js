/*!
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    fs = require('fs');

/*!
 * Create Express app and server.
 */

var app = express(),
    server = http.createServer(app);

/*!
 * Routes.
 */

app.get('/', function(req, res) {
    res.redirect(app.get('default-url'));
});

app.get('/*', function(req, res){
    res.redirect(app.get('base-url') + req.params[0]);
});

/*!
 * Configuration.
 */

app.set('version', fs.readFileSync('VERSION', 'utf8').trim());
app.set('base-url', 'http://cordova.apache.org/docs/');
app.set('default-url', app.get('base-url') + 'en/' + app.get('version'));

/*!
 * Start server.
 */

var port = process.env.PORT || 3000;
server.listen(port);
console.log('Listening on port %d in %s environment', port, app.settings.env);
