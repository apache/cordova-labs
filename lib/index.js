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
    res.redirect(app.get('home-url'));
});

app.get('/*', function(req, res){
    res.redirect(app.get('issue-url') + req.params[0]);
});

/*!
 * Configuration.
 */

app.set('home-url',  'https://issues.apache.org/jira/browse/CB');
app.set('issue-url', 'https://issues.apache.org/jira/browse/');

/*!
 * Start server.
 */

var port = process.env.PORT || 3000;
server.listen(port);
console.log('Listening on port %d in %s environment', port, app.settings.env);
