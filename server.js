var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    port = process.env.PORT || 5000;

http.createServer(function (req, res) {

    if (req.url === "/robots.txt") {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write("User-Agent: *\n");
        res.end("Disallow: /\n");
    } else if (req.url === "/") {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end("Hello!\n");    
	} else if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            res.writeHead(200, {'content-type': 'text/plain'});
            console.log(util.inspect({fields: fields, files: files}));
            
            res.write('received upload:\n\n');
            res.write(util.inspect({fields: fields, files: files}));
            console.log
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
