var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    port = process.env.PORT || 5000;
    stringify = require('json-stringify-safe');

var DIRECT_UPLOAD_LIMIT = 85; // bytes

// convert from UTF-8 to ISO-8859-1
var LATIN1_SYMBOLS = '¥§©ÆÖÑøøø¼';
var Iconv  = require('iconv').Iconv;
var iconv = new Iconv('UTF-8', 'ISO-8859-1');

http.createServer(function (req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');

    var basic_auth_username = "cordova_user";
    var basic_auth_password = "cordova_password";

    var header = req.headers['authorization']||'',        // get the header
        token = header.split(/\s+/).pop()||'',            // and the encoded auth token
        auth = new Buffer(token, 'base64').toString(),    // convert from base64
        parts = auth.split(/:/),                          // split on colon
        username = parts[0],
        password = parts[1];

    if (req.url === "/download_basic_auth") {
        if (username != basic_auth_username && password != basic_auth_password) {
            res.writeHead(401, {'Content-Type': 'text/plain'});
            res.end("401\n");
        } else {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write("User-Agent: *\n");
            res.end("Disallow: /\n");
        }
    } else if (req.url === "/robots.txt") {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write("User-Agent: *\n");
        res.end("Disallow: /\n");
    } else if (req.url === "/download_non_utf") {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write("User-Agent: *\n");

        res.write(iconv.convert(LATIN1_SYMBOLS));

        res.end("Disallow: /\n");
    } else if (req.url === "/") {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("Hello!\n");
    } else if (req.url == '/upload' && (req.method.toLowerCase() == 'post' || req.method.toLowerCase() == 'put')) {
        if(req.headers["content-type"].indexOf("multipart/form-data") === 0) {
            console.log("multipart/form upload");
            var form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files) {
                res.writeHead(200, {'content-type': 'text/plain'});
                console.log(stringify({fields: fields, files: files}));

                res.write(stringify({fields: fields, files: files}));
                res.end("\n");
            });
        } else {
            console.log("direct upload");
            var body = '';
            req.on('data', function(chunk) {
                body += chunk;
                if (body.length > DIRECT_UPLOAD_LIMIT) { 
                    req.connection.destroy();
                }
            });

            req.on('end', function() {
                console.log('All the data received is: ' + body);
                res.writeHead(200, "OK", {'content-type': 'text/plain'});
                res.write(body);
                res.end();
            });
        }
    } else if (req.url == '/upload_basic_auth' && req.method.toLowerCase() == 'post') {
        if (username != basic_auth_username && password != basic_auth_password) {
            res.writeHead(401, {'Content-Type': 'text/plain'});
            res.end("401\n");
        } else {
            var form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files) {
                res.writeHead(200, {'content-type': 'text/plain'});
                console.log(stringify({fields: fields, files: files}));

                res.write(stringify({fields: fields, files: files}));
                res.end("\n");
            });
        }
    } else if (req.url == '/upload_non_utf' && req.method.toLowerCase() == 'post') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            res.writeHead(200, {'content-type': 'text/plain'});
            console.log(stringify({fields: fields, files: files}));

            var buffer = iconv.convert(stringify({fields: fields, files: files, latin1Symbols: LATIN1_SYMBOLS}));
            res.write(buffer);

            res.end("\n");
        });
    } else if (req.url.match(/\d{3}/)) {
        var matches = req.url.match(/\d{3}/);
        status = matches[0];
        res.writeHead(status, {'Content-Type': 'text/plain'});
        res.end("You requested a " + status + "\n");
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end("404\n");
    }

    console.log(req.connection.remoteAddress + " " + req.method + " " + req.url + " " + res.statusCode + " " + req.headers['user-agent']);

}).listen(port, '0.0.0.0');
console.log('Server running on ' + port);