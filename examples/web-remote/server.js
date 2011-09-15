var connect = require('connect');
var fs = require('fs');

var mpris = require('../../lib/mpris');
var Player = mpris.Player;
var player = new Player('amarok');

var page = fs.readFileSync('remote.html', 'utf8');

connect.createServer(
	function(req, res, next) {
		var action = req.url.substr(1);
		switch (action) {
			case 'stop':
			case 'nextTrack':
			case 'previousTrack':
			case 'pause':
			case 'play':
				player[action]();
				res.writeHead(301, {'Location': '/'});
				res.end();
				return;
				break;
		}
		next();
	},
	function(req, res, next) {
		res.writeHead(200, {'Content-type': 'text/html'});
		res.write(page);
		res.end();
	}
).listen(1234);
